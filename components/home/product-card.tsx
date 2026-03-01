import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  name: string;
  specialty: string;
  image: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
};

function toKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function ProductCard({ name, specialty, image, slug, originalPrice, salePrice }: ProductCardProps) {
  return (
    <article className="home-product-card">
      <div className="home-product-image-wrap">
        <Image src={image} alt={`${name} 캐릭터`} fill sizes="(max-width: 768px) 100vw, 320px" className="home-product-image" />
      </div>
      <div className="home-product-body">
        <p className="home-product-name">{name}</p>
        <p className="home-product-specialty">{specialty}</p>
        <p className="home-product-price">
          <span>{toKrw(originalPrice)}원</span> {toKrw(salePrice)}원
        </p>
        <Link className="btn-secondary" href={`/premium/${slug}`}>
          사주방 입장
        </Link>
      </div>
    </article>
  );
}
