import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

// POST /api/products/import/1688 - 导入1688商品数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求体
    if (!body.products || !Array.isArray(body.products)) {
      return NextResponse.json(
        {
          success: false,
          message: '请求数据格式错误，products字段必须是数组'
        },
        { status: 400 }
      );
    }
    
    // 验证商品数据格式
    for (const product of body.products) {
      if (!product.title || !product.price || !product.link) {
        return NextResponse.json(
          {
            success: false,
            message: '商品数据不完整，必须包含title、price和link字段'
          },
          { status: 400 }
        );
      }
    }
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/import/1688`, {
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
    console.error('Import 1688 products API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '导入1688商品数据失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}