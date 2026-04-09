export async function initDB() {}
export async function addCredits(userId: string, credits: number) {}
export async function createOrder(order: any) {}
export async function getUserByEmail(email: string) { return null; }
export async function createUser(email: string, paypalEmail: string) { return { email, paypalEmail }; }
export async function updateOrderStatus(paypalOrderId: string, status: string) {}
export async function getUserCredits(userId: string) { return 999; }
