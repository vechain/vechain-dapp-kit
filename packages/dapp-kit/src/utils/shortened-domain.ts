/**
 * If a domain name is longer than 18 characters, it shortens it to 10 leading characters and 7 trailing characters.
 * @param domain - The domain name to shorten.
 * @returns The shortened domain name.
 */
export const shortenedDomain = (
    domain: string,
    leadingChars = 10,
    trailingChars = 7,
): string => {
    if (domain.length > leadingChars + trailingChars + 1) {
        return `${domain.slice(0, leadingChars)}…${domain.slice(
            -trailingChars,
        )}`;
    }
    return domain;
};
