import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Info, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">主题设置</h1>
        <p className="text-muted-foreground mt-2">自定义系统外观和颜色</p>
      </div>

      {/* 主题配置 Card */}
      <Card>
        <CardHeader>
          <CardTitle>主题配置</CardTitle>
          <CardDescription>选择您喜欢的颜色主题和明暗模式</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher />
        </CardContent>
      </Card>

      {/* 组件预览 Card */}
      <Card>
        <CardHeader>
          <CardTitle>组件预览</CardTitle>
          <CardDescription>查看当前主题下的组件样式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 按钮预览 */}
          <div className="space-y-3">
            <Label>按钮样式</Label>
            <div className="flex flex-wrap gap-2">
              <Button>默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">边框按钮</Button>
              <Button variant="destructive">危险按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                主色边框按钮
              </Button>
            </div>
          </div>

          {/* Select 预览 */}
          <div className="space-y-3">
            <Label>下拉选择</Label>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择一个选项" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="focus:bg-primary focus:text-primary-foreground" value="option1">选项 1</SelectItem>
                <SelectItem className="focus:bg-primary focus:text-primary-foreground" value="option2">选项 2</SelectItem>
                <SelectItem className="focus:bg-primary focus:text-primary-foreground" value="option3">选项 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert 预览 */}
          <div className="space-y-3">
            <Label>Alert 消息</Label>
            <div className="space-y-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>信息提示</AlertTitle>
                <AlertDescription>
                  这是一个信息类型的提示消息，用于展示一般信息。
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>警告提示</AlertTitle>
                <AlertDescription>
                  这是一个警告类型的提示消息，用于展示需要注意的内容。
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Card 预览 */}
          <div className="space-y-3">
            <Label>卡片样式</Label>
            <Card>
              <CardHeader>
                <CardTitle>示例卡片</CardTitle>
                <CardDescription>这是一个示例卡片，展示当前主题的卡片样式</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  卡片内容区域，可以包含任何类型的内容。当前主题会影响卡片的背景色、边框和文字颜色。
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
