import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { prisma } from './db';

const SESSION_COOKIE = 'belfrog_session';
const SESSION_DAYS = 7;

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex');
	const hash = scryptSync(password, salt, 64).toString('hex');
	return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
	const [scheme, salt, hash] = stored.split(':');
	if (scheme !== 'scrypt' || !salt || !hash) return false;
	const candidate = scryptSync(password, salt, 64);
	const expected = Buffer.from(hash, 'hex');
	return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createSession(userId: string): Promise<string> {
	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
	await prisma.session.create({
		data: { userId, tokenHash: hashToken(token), expiresAt }
	});
	return token;
}

export async function destroySession(token: string): Promise<void> {
	await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}

export async function getAdminByToken(
	token: string | undefined
): Promise<{ id: string; email: string; name: string } | null> {
	if (!token) return null;
	const session = await prisma.session.findUnique({
		where: { tokenHash: hashToken(token) },
		include: { user: true }
	});
	if (!session) return null;
	if (session.expiresAt.getTime() < Date.now()) {
		await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
		return null;
	}
	return { id: session.user.id, email: session.user.email, name: session.user.name };
}

export async function cleanupExpiredSessions(): Promise<void> {
	await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}

export { SESSION_COOKIE };
