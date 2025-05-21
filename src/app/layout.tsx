/**
 * @file layout.tsx
 * @description 这是整个应用的布局文件
 * @author Coiness
 * @date 2025-4-24
 */

import{Inter} from 'next/font/google'
import TopMenus from '@/components/topmenus'
import '@/globals.css'

// 字体配置，值加载拉丁字符集以优化性能
const inter = Inter({ subsets: ['latin'] })

// 页面的元数据配置
export const metadata = {
    title: '抬头率检测',
    description: '抬头率检测分析平台',
}

// 根布局组件
// 接收children属性，表示页面的子组件
// 该组件是整个应用的根布局，所有页面都将使用该布局
export default function RootLayout({
    children,}:{
    children: React.ReactNode
    }){
        return(
            <html lang="zh">
                <body className={inter.className}>
                    <TopMenus/>
                    <div className=" h-full overflow-hidden"> {/* 添加顶部内边距，为固定顶部导航栏留出空间 */}
                        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-[calc(100% - 4rem)] overflow-hidden box-border"> {/* 移除 overflow-hidden */}
                            {children}
                        </div>
                    </div>
                </body>
            </html>
        )
    }