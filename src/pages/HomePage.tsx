import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Image, Share2 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 xl:py-20">
        <div className="text-center mb-12 xl:mb-16 animate-fade-in">
          <h1 className="text-4xl xl:text-6xl font-bold mb-4 xl:mb-6">
            <span className="gradient-text">My Pet's Multiverse</span>
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            为你的宠物创造荒诞有趣的平行宇宙形象，用AI让想象力无限延伸
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 shadow-elegant hover:shadow-glow transition-smooth"
            onClick={() => navigate('/create')}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            开始创造宠物宇宙
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 max-w-5xl mx-auto mb-12">
          <Card className="p-6 xl:p-8 shadow-elegant hover:shadow-glow transition-smooth">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI智能生成</h3>
                <p className="text-muted-foreground">
                  输入宠物种类、选择身份和场景，AI自动生成精美的平行宇宙形象
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 xl:p-8 shadow-elegant hover:shadow-glow transition-smooth">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Image className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">多种艺术风格</h3>
                <p className="text-muted-foreground">
                  支持写实、卡通、油画、赛博朋克等多种风格，满足你的创意需求
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 xl:p-8 shadow-elegant hover:shadow-glow transition-smooth">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">一键分享</h3>
                <p className="text-muted-foreground">
                  生成的作品可以一键分享到社交平台，展示你的创意
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 xl:p-8 shadow-elegant hover:shadow-glow transition-smooth">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">创意模板库</h3>
                <p className="text-muted-foreground">
                  预设多种热门组合，快速开始你的创作之旅
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/gallery')}
          >
            浏览作品画廊
          </Button>
        </div>
      </div>
    </div>
  );
}
