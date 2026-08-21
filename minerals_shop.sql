-- =======================================================
-- Database Schema & Initial Data for Minerals Universe
-- Database: minerals_shop (or minerals_*)
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `Product`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Product`;
CREATE TABLE IF NOT EXISTS `Product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `img` varchar(191) NOT NULL,
  `cat` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `original` varchar(191) DEFAULT NULL,
  `sale` varchar(191) NOT NULL,
  `priceNum` double NOT NULL,
  `badge` varchar(191) NOT NULL,
  `stock` varchar(191) DEFAULT NULL,
  `desc` text NOT NULL,
  `origin` varchar(191) NOT NULL,
  `treatment` varchar(191) NOT NULL,
  `cert` varchar(191) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for `Product`
-- --------------------------------------------------------
INSERT INTO `Product` (`id`, `img`, `cat`, `name`, `original`, `sale`, `priceNum`, `badge`, `stock`, `desc`, `origin`, `treatment`, `cert`) VALUES
(1, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80', 'Aquamarine', 'Natural Aquamarine Emerald Cut — 4.8 Cts', '$480', '$385', 385, 'SALE', 'Only 2 left', 'A stunning natural aquamarine with exceptional clarity and a beautiful deep blue-green hue. Perfectly cut in an emerald pattern to maximize brilliance and fire.', 'Pakistan', 'Unheated', 'GIA'),
(2, 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=800&q=80', 'Garnet', 'Deep Red Pyrope Garnet Oval — 3.2 Cts', '$320', '$245', 245, 'BEST SELLER', NULL, 'A rich, fiery deep red pyrope garnet. This oval cut gemstone exhibits wonderful internal reflections and exceptional luster under any lighting conditions.', 'Afghanistan', 'None', 'Local Lab'),
(3, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80', 'Tourmaline', 'Pink Tourmaline Cushion Cut — 6.1 Cts', '$920', '$740', 740, 'NEW', 'Only 1 left', 'A vibrant pink tourmaline weighing over 6 carats. The cushion cut offers a classic vintage feel combined with modern brilliance, showing secondary violet flashes.', 'Brazil', 'Heated', 'IGI'),
(4, 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&q=80', 'Topaz', 'Imperial Topaz Pear Shape — 7.4 Cts', '$650', '$510', 510, 'LOW STOCK', 'Only 1 left', 'A rare and valuable imperial topaz featuring warm, golden-orange hues. The elegant pear shape elongates the stone beautifully, highlighting its magnificent double-refractive colors.', 'Russia', 'Irradiated', 'GIA'),
(6, 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80', 'Aquamarine', 'Ocean Blue Aquamarine Round — 2.5 Cts', NULL, '$490', 490, '', NULL, 'A round cut aquamarine of a beautiful pastel ocean blue color. Perfect for a delicate custom pendant or a premium engagement ring setting.', 'Pakistan', 'Unheated', 'GIA'),
(7, 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80', 'Tourmaline', 'Watermelon Tourmaline Slice — 12.5 Cts', '$1200', '$950', 950, 'RARE', NULL, 'A stunning watermelon tourmaline slice showcasing distinct green and pink concentric color zones. A true collector\'s item polished to a mirror-like finish.', 'Brazil', 'None', 'Local Lab'),
(101, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80', 'Sapphire', 'Royal Blue Sapphire — 2.8 Cts', '$1200', '$950', 950, 'PREMIUM', NULL, 'An intense, royal blue sapphire with excellent transparency and rich color saturation. Sourced from the Kashmir region, this is an investment-grade gemstone.', 'Kashmir', 'Unheated', 'GIA'),
(102, 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=800&q=80', 'Ruby', 'Pigeon Blood Ruby — 1.9 Cts', NULL, '$1500', 1500, 'RARE', NULL, 'A highly sought-after pigeon blood red ruby from Burma. Features classic ruby red glow under UV and rich crystal saturation, cut to perfection.', 'Burma', 'Heated', 'IGI'),
(103, 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80', 'Emerald', 'Vivid Green Emerald — 3.5 Cts', '$850', '$720', 720, '', NULL, 'A natural emerald showcasing a vivid green hue. Displays classic \'jardin\' inclusions characteristic of fine Colombian emeralds, adding unique character.', 'Colombia', 'Minor Oiled', 'GIA'),
(108, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80', 'Kunzite', 'Lilac Pink Kunzite — 15.2 Cts', NULL, '$340', 340, '', NULL, 'A massive lilac-pink kunzite crystal with strong pleochroism. Shines with elegant violet tones from different angles, exhibiting high clarity.', 'Afghanistan', 'None', 'Local Lab'),
(109, 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&q=80', 'Opals', 'Ethiopian Welo Opal — 5.8 Cts', '$220', '$180', 180, '', NULL, 'A vibrant natural Welo opal with incredible broad-flash play-of-color. Shows bright neon greens, reds, and oranges from every perspective.', 'Ethiopia', 'None', 'Local Lab'),
(110, 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80', 'Peridot', 'Apple Green Peridot — 4.6 Cts', NULL, '$150', 150, '', NULL, 'An apple-green peridot exhibiting high double-refraction and clean crystal quality. Sourced from the high-altitude Kohistan range.', 'Pakistan', 'None', 'GIA'),
(111, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80', 'Zircon', 'Blue Zircon Round Cut — 5.1 Cts', NULL, '$210', 210, '', NULL, 'A bright blue zircon with high fire and dispersion, cut in a brilliant round pattern that rivals diamond brilliance under light.', 'Cambodia', 'Heated', 'GIA'),
(112, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80', 'Morganite', 'Peach Morganite Oval — 6.8 Cts', '$450', '$380', 380, '', NULL, 'A romantic peach-pink morganite in a classic oval cut. Highly transparent with flawless clarity, perfect for rose gold custom jewelry settings.', 'Madagascar', 'None', 'IGI'),
(113, 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800&q=80', 'Quartz', 'Clear Quartz Cluster — Fine Grade', NULL, '$90', 90, '', NULL, 'A beautiful natural clear quartz crystal cluster, featuring multiple perfectly formed double-terminated points growing from a shared matrix.', 'Pakistan', 'None', 'None'),
(114, 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80', 'Amethyst', 'Deep Purple Amethyst Geode', '$200', '$160', 160, 'POPULAR', NULL, 'A premium deep purple amethyst cluster slice, exhibiting rich dark crystals with a natural protective agate rind around the edges.', 'Uruguay', 'None', 'None'),
(115, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80', 'Lapis Lazuli', 'Afghan Lapis Lazuli Polished', NULL, '$120', 120, '', NULL, 'A fine polished block of authentic royal blue lapis lazuli from Badakhshan, Afghanistan, featuring beautiful gold pyrite specks and white calcite veins.', 'Afghanistan', 'None', 'None');

-- --------------------------------------------------------
-- Table structure for `Order`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Order`;
CREATE TABLE IF NOT EXISTS `Order` (
  `id` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerEmail` varchar(191) NOT NULL,
  `customerPhone` varchar(191) NOT NULL,
  `shippingAddress` text NOT NULL,
  `total` double NOT NULL,
  `paymentMethod` varchar(191) NOT NULL,
  `paymentStatus` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Processing',
  `tracking` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `OrderItem`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `OrderItem`;
CREATE TABLE IF NOT EXISTS `OrderItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `orderId` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_fkey` (`orderId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `Inquiry`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Inquiry`;
CREATE TABLE IF NOT EXISTS `Inquiry` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` varchar(191) NOT NULL,
  `stoneType` varchar(191) DEFAULT NULL,
  `caratWeight` varchar(191) DEFAULT NULL,
  `preferredColor` varchar(191) DEFAULT NULL,
  `maxBudget` varchar(191) DEFAULT NULL,
  `intendedUse` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `Review`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Review`;
CREATE TABLE IF NOT EXISTS `Review` (
  `id` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `product` varchar(191) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `text` text NOT NULL,
  `status` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `User`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE IF NOT EXISTS `User` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` (`id`, `email`, `name`, `role`, `createdAt`) VALUES
('admin-user-01', 'drtoolofficial@gmail.com', 'Admin User', 'Admin', CURRENT_TIMESTAMP(3)),
('customer-user-01', 'customer@mineralsuniverse.com', 'Customer User', 'Customer', CURRENT_TIMESTAMP(3));

-- --------------------------------------------------------
-- Table structure for `Faq`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Faq`;
CREATE TABLE IF NOT EXISTS `Faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Faq` (`id`, `question`, `answer`, `createdAt`) VALUES
(1, 'Are your gemstones natural and untreated?', 'All our gemstones are 100% natural. We clearly disclose the treatment status of each stone in the product listing and certification. Untreated stones are specifically labelled and priced accordingly.', CURRENT_TIMESTAMP(3)),
(2, 'Do you provide certificates for your stones?', 'Yes. We offer certificates from internationally recognized laboratories including GIA, AGL, and Gübelin. Certificate options are indicated on each product page.', CURRENT_TIMESTAMP(3)),
(3, 'How long does international shipping take?', 'Standard insured shipping takes 7–14 business days internationally. Express DHL/FedEx (3–5 days) is available at an additional charge. All shipments are fully insured and tracked.', CURRENT_TIMESTAMP(3)),
(4, 'Can I request a specific stone or custom order?', 'Absolutely. Our custom order service lets you specify stone type, carat weight, color, origin preference, and budget. Use our Custom Order form or contact us on WhatsApp.', CURRENT_TIMESTAMP(3)),
(5, 'What payment methods do you accept?', 'We accept Visa, Mastercard, PayPal, Western Union, and direct bank transfer. All online transactions are SSL-encrypted.', CURRENT_TIMESTAMP(3));

-- --------------------------------------------------------
-- Table structure for `Setting`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `Setting`;
CREATE TABLE IF NOT EXISTS `Setting` (
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Setting` (`key`, `value`) VALUES
('instagramUrl', 'https://www.instagram.com/mineralsuniverse_'),
('tiktokUrl', 'https://www.tiktok.com/@mineralsuniverse1?_r=1&_t=ZN-95hIvZ38Z30'),
('youtubeUrl', 'https://youtube.com/@mineralsuniverse?si=8xemeeSlWzqPvsAA'),
('ebayUrl', 'https://www.ebay.com/usr/mineralsuniverse'),
('whatsappNumber', '923001581210');

SET FOREIGN_KEY_CHECKS = 1;
