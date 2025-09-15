import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/products/[id] - 获取单个商品详情
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '商品ID不能为空'
        },
        { status: 400 }
      );
    }
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            message: '商品不存在'
          },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取商品详情失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - 更新商品信息
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '商品ID不能为空'
        },
        { status: 400 }
      );
    }
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            message: '商品不存在'
          },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update product API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新商品失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '商品ID不能为空'
        },
        { status: 400 }
      );
    }
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            message: '商品不存在'
          },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除商品失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}