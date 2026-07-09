import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  // const isLoggedIn = !!req.auth
  // const { pathname } = req.nextUrl

  // // 公开路径（无需登录）
  // const publicPaths = ["/login"]
  // const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // // 如果未登录且访问非公开路径，重定向到登录页
  // if (!isLoggedIn && !isPublicPath) {
  //   return NextResponse.redirect(new URL("/login", req.url))
  // }

  // // 如果已登录且访问登录页，重定向到首页
  // if (isLoggedIn && pathname === "/login") {
  //   return NextResponse.redirect(new URL("/", req.url))
  // }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
