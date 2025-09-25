'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface PokemonCardProps {
  name: string;
  url: string;
}

export function PokemonCard({ name, url }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false);
  const id = url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Link href={`/pokemon/${name}`}>
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <div className="relative h-full w-full">
            <Image
              src={imageError ? fallbackUrl : imageUrl}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">#{String(id).padStart(3, '0')}</p>
          <h3 className="font-bold text-lg capitalize text-gray-800">{name}</h3>
        </div>
      </div>
    </Link>
  );
}