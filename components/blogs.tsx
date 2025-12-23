import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from './ui/card';
import Link from 'next/link';

const Blogs = () => {
  const blogs = [
    {
      id: 1,
      title: 'Understanding Heart Disease Prevention',
      excerpt:
        'Learn key strategies to prevent heart disease and maintain a healthy cardiovascular system.',
      category: 'Cardiology',
      image: '/heart-health-prevention.jpg',
      date: '2025-01-28',
    },
    {
      id: 2,
      title: 'Tips for Managing Chronic Pain',
      excerpt: 'Discover effective techniques and treatments for managing chronic pain conditions.',
      category: 'Pain Management',
      image: '/pain-management-techniques.jpg',
      date: '2025-01-25',
    },
    {
      id: 3,
      title: 'Mental Health Awareness in 2025',
      excerpt:
        'A comprehensive guide to mental health awareness and maintaining emotional wellness.',
      category: 'Mental Health',
      image: '/mental-health-wellness.png',
      date: '2025-01-22',
    },
    {
      id: 4,
      title: 'Nutrition for Better Health',
      excerpt: 'Explore balanced diet plans and nutritional guidance for optimal health outcomes.',
      category: 'Nutrition',
      image: '/healthy-nutrition-diet.jpg',
      date: '2025-01-20',
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="w-full py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Health & Wellness Blog
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Latest articles on health, wellness, and medical insights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col py-0">
                <div className="relative h-40 overflow-hidden bg-muted">
                  <Image
                    src={blog.image || '/placeholder.svg'}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {blog.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{blog.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;
