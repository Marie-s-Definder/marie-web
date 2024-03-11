/** 😴 */
export async function sleep(milli: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, milli);
    });
}
