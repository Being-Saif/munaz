import { useState } from 'react';
import ProductCard from './ProductCard';
import { cn } from '@utils/cn';

/**
 * ProductGrid manages the focus/unfocus state for all cards.
 * When one card is hovered, it becomes "focused" (scaled up, elevated),
 * while siblings become "unfocused" (slightly dimmed and scaled down).
 * 
 * Default: 2 cols on mobile, 3 cols on desktop
 */
const ProductGrid = ({ products, columns = { sm: 2, md: 3, lg: 3 }, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Map columns to Tailwind classes
  const getGridClass = () => {
    const sm = columns.sm || 2;
    const md = columns.md || 3;
    const lg = columns.lg || 3;

    const smClass = `grid-cols-${sm}`;
    const mdClass = `md:grid-cols-${md}`;
    const lgClass = `lg:grid-cols-${lg}`;

    return `${smClass} ${mdClass} ${lgClass}`;
  };

  return (
    <div className={cn('grid gap-3 sm:gap-4 lg:gap-5', getGridClass(), className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          isHovered={
            hoveredIndex === null
              ? undefined
              : hoveredIndex === index
                ? true
                : false
          }
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
