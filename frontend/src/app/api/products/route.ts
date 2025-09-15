import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

// GET /api/products - 获取商品列表
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/products${queryString ? `?${queryString}` : ''}`;
    
    // 转发请求到后端
    const response = await fetch(backendUrl, {
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
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取商品列表失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/products - 创建商品（如果后端支持）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建商品失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products - 清空所有商品
export async function DELETE(request: NextRequest) {
  try {
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/clear`, {
      method: 'DELETE',
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
    console.error('Clear products API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '清空商品失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}