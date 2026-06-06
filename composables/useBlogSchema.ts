// composables/useBlogSchema.ts
import type { Blog } from "./blogs";

export function useBlogSchema(blog: Blog, lang: "en" | "ar") {
  const title = blog.title[lang];
  const description = blog.description[lang];
  const slug = blog.slug[lang];

  // Clean content for description if needed
  const cleanContent = blog.content[lang]
    .replace(/[#*`]/g, "")
    .replace(/\s+/g, " ")
    .substring(0, 200);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || cleanContent,
    keywords: [
      `${title} investment`,
      `${title} real estate`,
      "Dubai real estate",
      "UAE property investment",
      "Comma Real Estate",
      "luxury properties",
      lang === "en" ? "real estate market analysis" : "تحليل سوق العقارات",
    ],
    author: {
      "@type": "Organization",
      name: "Comma Real Estate",
      url: "https://commarealestate.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Comma Real Estate",
      logo: {
        "@type": "ImageObject",
        url: "https://commarealestate.com/images/logo.png",
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://commarealestate.com/blog/${slug}`,
    },
  };

  return schema;
}
