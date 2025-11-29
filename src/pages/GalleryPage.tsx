import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getUserGenerations } from '@/db/api';
import { getUserId } from '@/utils/userIdManager';
import type { Generation } from '@/types/types';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadGenerations = useCallback(async (pageNum: number) => {
    const userId = getUserId();
    setIsLoading(true);

    try {
      const data = await getUserGenerations(userId, pageNum, 20);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setGenerations((prev) => (pageNum === 0 ? data : [...prev, ...data]));
        if (data.length < 20) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGenerations(0);
  }, [loadGenerations]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 0) {
      loadGenerations(page);
    }
  }, [page, loadGenerations]);

  const successGenerations = generations.filter((g) => g.status === 'success' && g.image_url);

  return (
    <div className="min-h-screen bg-background py-8 xl:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">
            <span className="gradient-text">我的作品画廊</span>
          </h1>
          <p className="text-muted-foreground mb-6">浏览你创造的所有宠物平行宇宙形象</p>
          <Button onClick={() => navigate('/create')} className="shadow-elegant hover:shadow-glow">
            <Sparkles className="mr-2 h-4 w-4" />
            创建新作品
          </Button>
        </div>

        {isLoading && page === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : successGenerations.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-medium mb-2">还没有作品</p>
            <p className="text-muted-foreground mb-6">开始创造你的第一个宠物平行宇宙形象吧</p>
            <Button onClick={() => navigate('/create')} className="shadow-elegant hover:shadow-glow">
              <Sparkles className="mr-2 h-4 w-4" />
              开始创作
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {successGenerations.map((generation) => (
                <Card
                  key={generation.id}
                  className="cursor-pointer transition-smooth hover:shadow-glow overflow-hidden"
                  onClick={() => navigate(`/result/${generation.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-muted">
                      {generation.image_url && (
                        <img
                          src={generation.image_url}
                          alt={`${generation.pet_type}的${generation.new_identity}形象`}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">
                        {generation.pet_type} × {generation.new_identity}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{generation.scenario}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(generation.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            )}

            {!hasMore && successGenerations.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">已加载全部作品</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
