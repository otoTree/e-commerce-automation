'use client';

import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { ProductsPage } from '../../components/products';

export default function ProductsPageRoute() {
  return (
    <Layout>
      <ProductsPage />
    </Layout>
  );
}