import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

// GET /api/products/stats - 获取商品统计信息
export async function GET(request: NextRequest) {
  try {
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product stats API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取商品统计信息失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}