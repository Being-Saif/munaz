import { useState } from 'react';
import ProductCard from './ProductCard';
import { cn } from '@utils/cn';

/**
 * ProductGrid manages the focus/unfocus state for all cards.
 * When one card is hovered, it becomes "focused" (scaled up, elevated),
 * while siblings become "unfocused" (slightly dimmed and scaled down).
 */
const ProductGrid = ({ products, columns = {}, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const gridCols = columns.sm || 2;
  const gridColsMd = columns.md || 3;
  const gridColsLg = columns.lg || 4;

  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-5 lg:gap-6',
        `grid-cols-${gridCols}`,
        `md:grid-cols-${gridColsMd}`,
        `lg:grid-cols-${gridColsLg}`,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      }}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          isHovered={
            hoveredIndex === null
              ? undefined          // No card hovered — default state
              : hoveredIndex === index
                ? true             // This card is hovered — focus
                : false            // Another card is hovered — unfocus
          }
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
