import Image from 'next/image';

type CharacterHeroProps = {
  name: string;
  specialty: string;
  image: string;
};

export function CharacterHero({ name, specialty, image }: CharacterHeroProps) {
  return (
    <section className="fortune-hero">
      <Image src={image} alt={`${name} 캐릭터`} fill sizes="100vw" className="fortune-hero-image" priority />
      <div className="fortune-hero-overlay" />
      <div className="fortune-hero-content">
        <p>{specialty}</p>
        <h1>{name} 사주방</h1>
      </div>
    </section>
  );
}
