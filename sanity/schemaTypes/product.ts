import { defineArrayMember, defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: '商品',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: '商品名稱', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: '網址代稱',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: '價格 (NT$)',
      type: 'number',
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: 'series',
      title: '系列',
      type: 'string',
      initialValue: 'nullcraft',
      options: {
        list: [
          { title: 'NULLCRAFT', value: 'nullcraft' },
          { title: 'PRE-LOVED', value: 'preloved' },
          { title: 'MINERALS', value: 'minerals' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'category', title: '分類', type: 'string' }),
    defineField({
      name: 'stockType',
      title: '類型',
      type: 'string',
      initialValue: 'in-stock',
      options: {
        list: [
          { title: 'IN STOCK 現貨', value: 'in-stock' },
          { title: 'AI MADE AI製', value: 'ai-made' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'description', title: '商品描述', type: 'text', rows: 5 }),
    defineField({
      name: 'mainImage',
      title: '商品主圖',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: '圖片替代文字', type: 'string' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: '標籤',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'sold', title: '已售出', type: 'boolean', initialValue: false }),
    defineField({ name: 'sortOrder', title: '排序 (數字越大越前)', type: 'number', initialValue: 0 }),
    defineField({ name: 'originalCreatedAt', title: '原站建立時間', type: 'datetime', readOnly: true }),
    defineField({ name: 'legacyId', title: '原站商品 ID', type: 'number', readOnly: true }),
    defineField({ name: 'legacyImageUrl', title: '原站主圖網址', type: 'url', readOnly: true }),
  ],
  orderings: [
    { title: '排序 (sortOrder)', name: 'sortOrderDesc', by: [{ field: 'sortOrder', direction: 'desc' }] },
    { title: '原站建立時間', name: 'originalCreatedAtDesc', by: [{ field: 'originalCreatedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'series', media: 'mainImage', sold: 'sold' },
    prepare: ({ title, subtitle, media, sold }) => ({
      title: sold ? `[SOLD] ${title}` : title,
      subtitle: String(subtitle || '').toUpperCase(),
      media,
    }),
  },
});
