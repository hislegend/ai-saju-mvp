import { redirect } from 'next/navigation';
import { DEFAULT_PRODUCT_SLUG } from '@/lib/products';

export default function PremiumRootPage() {
  redirect(`/premium/${DEFAULT_PRODUCT_SLUG}`);
}
