'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePokemonDetail } from '@/lib/hooks/usePokemon';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fighting: 'bg-red-600',
  flying: 'bg-indigo-400',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  rock: 'bg-yellow-800',
  bug: 'bg-green-400',
  ghost: 'bg-purple-700',
  steel: 'bg-gray-500',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-blue-300',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-300',
};

const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;
  const [imageError, setImageError] = useState(false);

  const { data: pokemon, isLoading, isError } = usePokemonDetail(name);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Pokemon details...</p>
        </div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading Pokemon details.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const fallbackUrl = pokemon.sprites.front_default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Pokédex
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src={imageError ? fallbackUrl : imageUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="mb-6">
                <p className="text-gray-500 text-lg">#{String(pokemon.id).padStart(3, '0')}</p>
                <h1 className="text-4xl font-bold capitalize text-gray-800 mb-4">{pokemon.name}</h1>

                <div className="flex gap-2 mb-4">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        typeColors[type.type.name] || 'bg-gray-400'
                      }`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Height</p>
                    <p className="text-xl font-semibold">{pokemon.height / 10} m</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Weight</p>
                    <p className="text-xl font-semibold">{pokemon.weight / 10} kg</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Abilities</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability.ability.name}
                      className={`px-3 py-1 rounded-lg ${
                        ability.is_hidden
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      } font-medium`}
                    >
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Base Stats</h2>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => {
                    const percentage = (stat.base_stat / 255) * 100;
                    return (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {statNames[stat.stat.name] || stat.stat.name}
                          </span>
                          <span className="text-sm font-bold text-gray-900">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}