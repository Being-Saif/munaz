import HeroSlider from '@components/home/HeroSlider';
import TrustBadges from '@components/home/TrustBadges';
import CategoryGrid from '@components/home/CategoryGrid';
import FlashSale from '@components/home/FlashSale';
import TrendingProducts from '@components/home/TrendingProducts';
import Testimonials from '@components/home/Testimonials';
import Newsletter from '@components/home/Newsletter';

const HomePage = () => {
  return (
    <div>
      {/* Hero Slider — Full-width with text animations */}
      <HeroSlider />

      {/* Trust Badges — Free Shipping, Returns, etc. */}
      <TrustBadges />

      {/* Shop By Category — Circular cards with hover effects */}
      <CategoryGrid />

      {/* Flash Sale — Dark section with countdown + carousel */}
      <FlashSale />

      {/* Trending / New Arrivals / Best Sellers — Tab switching with focus/unfocus cards */}
      <TrendingProducts />

      {/* Customer Testimonials — 3 auto-sliding review cards */}
      <Testimonials />

      {/* Newsletter — Gradient CTA with subscribe form */}
      <Newsletter />
    </div>
  );
};

export default HomePage;
