import { NextRequest, NextResponse } from 'next/server';

// 后端API基础URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // 构建后端API URL
    const backendUrl = `${BACKEND_API_URL}/api/tasks${queryString ? `?${queryString}` : ''}`;
    
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
    console.error('Tasks API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取任务列表失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/tasks - 创建任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.title || !body.type) {
      return NextResponse.json(
        {
          success: false,
          message: '任务标题和类型是必需的'
        },
        { status: 400 }
      );
    }
    
    // 转发请求到后端
    const response = await fetch(`${BACKEND_API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create task API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建任务失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}