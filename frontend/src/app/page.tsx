'use client';

import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../components/dashboard';

export default function HomePage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
