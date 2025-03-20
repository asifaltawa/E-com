export const ITEMS_PER_PAGE = 10
export function discountPrice(price, discountPercentage) {
    return Math.round(price * (1 - discountPercentage / 100));
}