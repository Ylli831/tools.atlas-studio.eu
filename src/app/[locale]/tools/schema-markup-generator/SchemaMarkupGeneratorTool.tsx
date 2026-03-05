"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type SchemaType = "article" | "faq" | "product" | "local_business" | "howto";

interface ArticleData {
  headline: string;
  description: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  datePublished: string;
  dateModified: string;
  image: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ProductData {
  name: string;
  description: string;
  image: string;
  brand: string;
  sku: string;
  price: string;
  currency: string;
  availability: string;
  ratingValue: string;
  reviewCount: string;
}

interface LocalBusinessData {
  name: string;
  description: string;
  image: string;
  telephone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  priceRange: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface HowToData {
  name: string;
  description: string;
  totalTime: string;
  estimatedCost: string;
  currency: string;
  steps: HowToStep[];
}

function generateArticleSchema(data: ArticleData): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
  };
  if (data.description) schema.description = data.description;
  if (data.image) schema.image = [data.image];
  if (data.authorName) schema.author = { "@type": "Person", name: data.authorName };
  if (data.publisherName) {
    const publisher: Record<string, unknown> = { "@type": "Organization", name: data.publisherName };
    if (data.publisherLogo) publisher.logo = { "@type": "ImageObject", url: data.publisherLogo };
    schema.publisher = publisher;
  }
  if (data.datePublished) schema.datePublished = data.datePublished;
  if (data.dateModified) schema.dateModified = data.dateModified;
  return schema;
}

function generateFaqSchema(items: FaqItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((item) => item.question && item.answer)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
  };
}

function generateProductSchema(data: ProductData): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
  };
  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;
  if (data.brand) schema.brand = { "@type": "Brand", name: data.brand };
  if (data.sku) schema.sku = data.sku;
  const offers: Record<string, unknown> = { "@type": "Offer" };
  if (data.price) offers.price = data.price;
  if (data.currency) offers.priceCurrency = data.currency;
  if (data.availability) offers.availability = `https://schema.org/${data.availability}`;
  schema.offers = offers;
  if (data.ratingValue && data.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: data.ratingValue,
      reviewCount: data.reviewCount,
    };
  }
  return schema;
}

function generateLocalBusinessSchema(data: LocalBusinessData): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
  };
  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;
  if (data.telephone) schema.telephone = data.telephone;
  if (data.priceRange) schema.priceRange = data.priceRange;
  const address: Record<string, string> = { "@type": "PostalAddress" };
  if (data.streetAddress) address.streetAddress = data.streetAddress;
  if (data.city) address.addressLocality = data.city;
  if (data.state) address.addressRegion = data.state;
  if (data.postalCode) address.postalCode = data.postalCode;
  if (data.country) address.addressCountry = data.country;
  if (Object.keys(address).length > 1) schema.address = address;
  if (data.latitude && data.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }
  return schema;
}

function generateHowToSchema(data: HowToData): object {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
  };
  if (data.description) schema.description = data.description;
  if (data.totalTime) schema.totalTime = data.totalTime;
  if (data.estimatedCost && data.currency) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: data.currency,
      value: data.estimatedCost,
    };
  }
  schema.step = data.steps
    .filter((s) => s.name || s.text)
    .map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    }));
  return schema;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function SchemaMarkupGeneratorTool() {
  const t = useTranslations("tools.schema-markup-generator");
  const tc = useTranslations("common");
  const [schemaType, setSchemaType] = useState<SchemaType>("article");
  const [output, setOutput] = useState("");

  // Article state
  const [article, setArticle] = useState<ArticleData>({
    headline: "", description: "", authorName: "", publisherName: "",
    publisherLogo: "", datePublished: "", dateModified: "", image: "",
  });

  // FAQ state
  const [faqItems, setFaqItems] = useState<(FaqItem & { id: string })[]>([
    { id: generateId(), question: "", answer: "" },
  ]);

  // Product state
  const [product, setProduct] = useState<ProductData>({
    name: "", description: "", image: "", brand: "", sku: "",
    price: "", currency: "USD", availability: "InStock",
    ratingValue: "", reviewCount: "",
  });

  // LocalBusiness state
  const [business, setBusiness] = useState<LocalBusinessData>({
    name: "", description: "", image: "", telephone: "",
    streetAddress: "", city: "", state: "", postalCode: "",
    country: "", latitude: "", longitude: "", priceRange: "",
  });

  // HowTo state
  const [howto, setHowto] = useState<HowToData>({
    name: "", description: "", totalTime: "", estimatedCost: "", currency: "USD",
    steps: [{ name: "", text: "" }],
  });

  const handleGenerate = useCallback(() => {
    let schema: object;
    switch (schemaType) {
      case "article":
        schema = generateArticleSchema(article);
        break;
      case "faq":
        schema = generateFaqSchema(faqItems);
        break;
      case "product":
        schema = generateProductSchema(product);
        break;
      case "local_business":
        schema = generateLocalBusinessSchema(business);
        break;
      case "howto":
        schema = generateHowToSchema(howto);
        break;
    }
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    setOutput(jsonLd);
  }, [schemaType, article, faqItems, product, business, howto]);

  const inputClass = "w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal";
  const labelClass = "text-sm font-medium text-foreground mb-1 block";

  return (
    <ToolLayout toolSlug="schema-markup-generator">
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <label className={labelClass}>{t("schema_type")}</label>
          <select
            value={schemaType}
            onChange={(e) => { setSchemaType(e.target.value as SchemaType); setOutput(""); }}
            className={inputClass}
          >
            <option value="article">{t("article")}</option>
            <option value="faq">{t("faq")}</option>
            <option value="product">{t("product")}</option>
            <option value="local_business">{t("local_business")}</option>
            <option value="howto">{t("howto")}</option>
          </select>
        </div>

        {/* Article Form */}
        {schemaType === "article" && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div>
              <label className={labelClass}>Headline *</label>
              <input type="text" value={article.headline} onChange={(e) => setArticle((p) => ({ ...p, headline: e.target.value }))} placeholder="Article headline" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={article.description} onChange={(e) => setArticle((p) => ({ ...p, description: e.target.value }))} rows={3} className={inputClass} placeholder="Article description" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Author Name</label>
                <input type="text" value={article.authorName} onChange={(e) => setArticle((p) => ({ ...p, authorName: e.target.value }))} className={inputClass} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelClass}>Image URL</label>
                <input type="url" value={article.image} onChange={(e) => setArticle((p) => ({ ...p, image: e.target.value }))} className={inputClass} placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className={labelClass}>Publisher Name</label>
                <input type="text" value={article.publisherName} onChange={(e) => setArticle((p) => ({ ...p, publisherName: e.target.value }))} className={inputClass} placeholder="Publisher Inc." />
              </div>
              <div>
                <label className={labelClass}>Publisher Logo URL</label>
                <input type="url" value={article.publisherLogo} onChange={(e) => setArticle((p) => ({ ...p, publisherLogo: e.target.value }))} className={inputClass} placeholder="https://example.com/logo.png" />
              </div>
              <div>
                <label className={labelClass}>Date Published</label>
                <input type="date" value={article.datePublished} onChange={(e) => setArticle((p) => ({ ...p, datePublished: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date Modified</label>
                <input type="date" value={article.dateModified} onChange={(e) => setArticle((p) => ({ ...p, dateModified: e.target.value }))} className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* FAQ Form */}
        {schemaType === "faq" && (
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Q&A #{index + 1}</label>
                  {faqItems.length > 1 && (
                    <button onClick={() => setFaqItems((prev) => prev.filter((f) => f.id !== item.id))} className="text-xs text-danger">{tc("remove")}</button>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Question</label>
                  <input type="text" value={item.question} onChange={(e) => setFaqItems((prev) => prev.map((f) => f.id === item.id ? { ...f, question: e.target.value } : f))} className={inputClass} placeholder="What is...?" />
                </div>
                <div>
                  <label className={labelClass}>Answer</label>
                  <textarea value={item.answer} onChange={(e) => setFaqItems((prev) => prev.map((f) => f.id === item.id ? { ...f, answer: e.target.value } : f))} rows={2} className={inputClass} placeholder="The answer is..." />
                </div>
              </div>
            ))}
            <button onClick={() => setFaqItems((prev) => [...prev, { id: generateId(), question: "", answer: "" }])} className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm w-full">
              + Add Question
            </button>
          </div>
        )}

        {/* Product Form */}
        {schemaType === "product" && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input type="text" value={product.name} onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Product name" />
              </div>
              <div>
                <label className={labelClass}>Brand</label>
                <input type="text" value={product.brand} onChange={(e) => setProduct((p) => ({ ...p, brand: e.target.value }))} className={inputClass} placeholder="Brand name" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={product.description} onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} placeholder="Product description" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Image URL</label>
                <input type="url" value={product.image} onChange={(e) => setProduct((p) => ({ ...p, image: e.target.value }))} className={inputClass} placeholder="https://example.com/product.jpg" />
              </div>
              <div>
                <label className={labelClass}>SKU</label>
                <input type="text" value={product.sku} onChange={(e) => setProduct((p) => ({ ...p, sku: e.target.value }))} className={inputClass} placeholder="SKU-12345" />
              </div>
              <div>
                <label className={labelClass}>Price</label>
                <input type="number" step="0.01" value={product.price} onChange={(e) => setProduct((p) => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="29.99" />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select value={product.currency} onChange={(e) => setProduct((p) => ({ ...p, currency: e.target.value }))} className={inputClass}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Availability</label>
                <select value={product.availability} onChange={(e) => setProduct((p) => ({ ...p, availability: e.target.value }))} className={inputClass}>
                  <option value="InStock">In Stock</option>
                  <option value="OutOfStock">Out of Stock</option>
                  <option value="PreOrder">Pre-Order</option>
                  <option value="LimitedAvailability">Limited Availability</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Rating Value</label>
                <input type="number" step="0.1" min="0" max="5" value={product.ratingValue} onChange={(e) => setProduct((p) => ({ ...p, ratingValue: e.target.value }))} className={inputClass} placeholder="4.5" />
              </div>
              <div>
                <label className={labelClass}>Review Count</label>
                <input type="number" value={product.reviewCount} onChange={(e) => setProduct((p) => ({ ...p, reviewCount: e.target.value }))} className={inputClass} placeholder="120" />
              </div>
            </div>
          </div>
        )}

        {/* LocalBusiness Form */}
        {schemaType === "local_business" && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Business Name *</label>
                <input type="text" value={business.name} onChange={(e) => setBusiness((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Business name" />
              </div>
              <div>
                <label className={labelClass}>Telephone</label>
                <input type="tel" value={business.telephone} onChange={(e) => setBusiness((p) => ({ ...p, telephone: e.target.value }))} className={inputClass} placeholder="+1-555-555-5555" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={business.description} onChange={(e) => setBusiness((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} placeholder="Business description" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Street Address</label>
                <input type="text" value={business.streetAddress} onChange={(e) => setBusiness((p) => ({ ...p, streetAddress: e.target.value }))} className={inputClass} placeholder="123 Main St" />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={business.city} onChange={(e) => setBusiness((p) => ({ ...p, city: e.target.value }))} className={inputClass} placeholder="City" />
              </div>
              <div>
                <label className={labelClass}>State/Region</label>
                <input type="text" value={business.state} onChange={(e) => setBusiness((p) => ({ ...p, state: e.target.value }))} className={inputClass} placeholder="State" />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input type="text" value={business.postalCode} onChange={(e) => setBusiness((p) => ({ ...p, postalCode: e.target.value }))} className={inputClass} placeholder="12345" />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" value={business.country} onChange={(e) => setBusiness((p) => ({ ...p, country: e.target.value }))} className={inputClass} placeholder="US" />
              </div>
              <div>
                <label className={labelClass}>Image URL</label>
                <input type="url" value={business.image} onChange={(e) => setBusiness((p) => ({ ...p, image: e.target.value }))} className={inputClass} placeholder="https://example.com/photo.jpg" />
              </div>
              <div>
                <label className={labelClass}>Latitude</label>
                <input type="text" value={business.latitude} onChange={(e) => setBusiness((p) => ({ ...p, latitude: e.target.value }))} className={inputClass} placeholder="40.7128" />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input type="text" value={business.longitude} onChange={(e) => setBusiness((p) => ({ ...p, longitude: e.target.value }))} className={inputClass} placeholder="-74.0060" />
              </div>
              <div>
                <label className={labelClass}>Price Range</label>
                <select value={business.priceRange} onChange={(e) => setBusiness((p) => ({ ...p, priceRange: e.target.value }))} className={inputClass}>
                  <option value="">Select...</option>
                  <option value="$">$ (Inexpensive)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Very Expensive)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* HowTo Form */}
        {schemaType === "howto" && (
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" value={howto.name} onChange={(e) => setHowto((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="How to..." />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={howto.description} onChange={(e) => setHowto((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputClass} placeholder="A guide to..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Total Time (ISO 8601)</label>
                  <input type="text" value={howto.totalTime} onChange={(e) => setHowto((p) => ({ ...p, totalTime: e.target.value }))} className={inputClass} placeholder="PT30M" />
                </div>
                <div>
                  <label className={labelClass}>Estimated Cost</label>
                  <input type="number" step="0.01" value={howto.estimatedCost} onChange={(e) => setHowto((p) => ({ ...p, estimatedCost: e.target.value }))} className={inputClass} placeholder="20.00" />
                </div>
                <div>
                  <label className={labelClass}>Currency</label>
                  <select value={howto.currency} onChange={(e) => setHowto((p) => ({ ...p, currency: e.target.value }))} className={inputClass}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>
              </div>
            </div>

            {howto.steps.map((step, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Step {index + 1}</label>
                  {howto.steps.length > 1 && (
                    <button onClick={() => setHowto((p) => ({ ...p, steps: p.steps.filter((_, i) => i !== index) }))} className="text-xs text-danger">{tc("remove")}</button>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Step Name</label>
                  <input type="text" value={step.name} onChange={(e) => { const steps = [...howto.steps]; steps[index] = { ...steps[index], name: e.target.value }; setHowto((p) => ({ ...p, steps })); }} className={inputClass} placeholder="Step name" />
                </div>
                <div>
                  <label className={labelClass}>Step Instructions</label>
                  <textarea value={step.text} onChange={(e) => { const steps = [...howto.steps]; steps[index] = { ...steps[index], text: e.target.value }; setHowto((p) => ({ ...p, steps })); }} rows={2} className={inputClass} placeholder="Detailed instructions..." />
                </div>
              </div>
            ))}
            <button onClick={() => setHowto((p) => ({ ...p, steps: [...p.steps, { name: "", text: "" }] }))} className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm w-full">
              + Add Step
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleGenerate}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("generate")}
          </button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                {t("output_label")}
              </label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
