import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, RotateCcw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getGenerationById } from '@/db/api';
import type { Generation } from '@/types/types';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    loadGeneration();
  }, [id]);

  const loadGeneration = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await getGenerationById(id);
      if (!data) {
        toast({
          title: '未找到记录',
          description: '该生成记录不存在',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      setGeneration(data);
    } catch (error) {
      console.error('加载失败:', error);
      toast({
        title: '加载失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generation?.image_url) return;

    try {
      const response = await fetch(generation.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pet-multiverse-${generation.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: '下载成功',
        description: '图片已保存到本地',
      });
    } catch (error) {
      console.error('下载失败:', error);
      toast({
        title: '下载失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!generation?.image_url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Pet\'s Multiverse',
          text: `看看我用AI创造的宠物平行宇宙形象！${generation.pet_type}变身${generation.new_identity}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: '链接已复制',
        description: '可以分享给朋友了',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!generation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 xl:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">
            <span className="gradient-text">你的宠物宇宙</span>
          </h1>
          <p className="text-muted-foreground">AI为你创造的独特平行宇宙形象</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              {generation.image_url ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={generation.image_url}
                    alt={`${generation.pet_type}的${generation.new_identity}形象`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">图片加载中...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>生成信息</CardTitle>
                <CardDescription>你的创作参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">宠物种类</p>
                  <p className="font-medium">{generation.pet_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">新身份</p>
                  <p className="font-medium">{generation.new_identity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">任务场景</p>
                  <p className="font-medium">{generation.scenario}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">艺术风格</p>
                  <p className="font-medium">{generation.style}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>AI生成指令</CardTitle>
                <CardDescription>用于生成图片的完整提示词</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{generation.prompt}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownload}
                disabled={!generation.image_url}
              >
                <Download className="mr-2 h-4 w-4" />
                下载
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleShare}
                disabled={!generation.image_url}
              >
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </Button>
              <Button
                className="w-full shadow-elegant hover:shadow-glow"
                onClick={() => navigate('/create')}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                再试一次
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/gallery')}
            >
              查看我的作品
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
