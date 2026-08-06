import HeroBanner from '@components/home/HeroBanner';
import CategoryStrip from '@components/home/CategoryStrip';
import NewArrivals from '@components/home/NewArrivals';
import PromoBanner from '@components/home/PromoBanner';
import ShopByOccasion from '@components/home/ShopByOccasion';
import TrendingCarousel from '@components/home/TrendingCarousel';
import WhyShopWithUs from '@components/home/WhyShopWithUs';
import NewsletterBanner from '@components/home/NewsletterBanner';

const HomePage = () => {
  return (
    <div>
      {/* Hero Banner — Full-width image slider like biba.in */}
      <HeroBanner />

      {/* Shop By Category — Rectangular cards with overlapping text */}
      <CategoryStrip />

      {/* New Arrivals — Clean product grid */}
      <NewArrivals />

      {/* Promotional Offer Banners — Side by side deal banners */}
      <PromoBanner />

      {/* Shop By Occasion — Wedding, Festive, Casual, Office */}
      <ShopByOccasion />

      {/* Trending Now — Horizontal product carousel */}
      <TrendingCarousel />

      {/* Why Shop With Us — Trust icons */}
      <WhyShopWithUs />

      {/* Newsletter — Subscribe banner */}
      <NewsletterBanner />
    </div>
  );
};

export default HomePage;
