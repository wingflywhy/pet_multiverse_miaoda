import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Sparkles, Loader2 } from 'lucide-react';
import { generatePrompt, creativeTemplates, type CreativeTemplate } from '@/utils/promptGenerator';
import { getUserId } from '@/utils/userIdManager';
import { submitTextToImage, pollImageResult, downloadImageAsBlob } from '@/services/aiImageService';
import { createGeneration, updateGeneration, uploadImageToStorage } from '@/db/api';

interface FormValues {
  petType: string;
  newIdentity: string;
  scenario: string;
  style: string;
}

const petTypes = ['柴犬', '橘猫', '哈士奇', '金毛', '柯基', '英国短毛猫', '布偶猫', '暹罗猫'];
const identities = ['国际特工', '宇航员', '摇滚明星', '厨师', '超级英雄', '海盗船长', '武士', '魔法师', '赛车手', '探险家'];
const scenarios = ['雪山顶上秘密接头', '太空站执行任务', '演唱会舞台中央', '米其林餐厅厨房', '城市上空飞翔', '加勒比海航行', '古代战场', '魔法森林', '赛道上飞驰', '热带雨林探险'];
const styles = ['写实', '卡通', '油画', '赛博朋克', '水彩', '像素艺术', '素描', '动漫'];

export default function CreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStatus, setGeneratingStatus] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CreativeTemplate | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      petType: '',
      newIdentity: '',
      scenario: '',
      style: '',
    },
  });

  const handleTemplateSelect = (template: CreativeTemplate) => {
    setSelectedTemplate(template);
    form.setValue('petType', template.petType);
    form.setValue('newIdentity', template.newIdentity);
    form.setValue('scenario', template.scenario);
    form.setValue('style', template.style);
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.petType || !values.newIdentity || !values.scenario || !values.style) {
      toast({
        title: '请填写完整信息',
        description: '所有字段都是必填的',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    const userId = getUserId();

    try {
      setGeneratingStatus('正在生成AI指令...');
      const prompt = generatePrompt({
        petType: values.petType,
        newIdentity: values.newIdentity,
        scenario: values.scenario,
        style: values.style,
      });

      setGeneratingStatus('正在创建生成记录...');
      const generation = await createGeneration({
        user_id: userId,
        pet_type: values.petType,
        new_identity: values.newIdentity,
        scenario: values.scenario,
        style: values.style,
        prompt: prompt,
        status: 'processing',
      });

      if (!generation) {
        throw new Error('创建生成记录失败');
      }

      setGeneratingStatus('正在提交AI作画任务...');
      const submitResult = await submitTextToImage({ prompt });

      await updateGeneration(generation.id, {
        task_id: submitResult.data.task_id,
      });

      setGeneratingStatus('正在生成图片，预计等待30-60秒...');
      const imageUrl = await pollImageResult(submitResult.data.task_id);

      setGeneratingStatus('正在下载并保存图片...');
      const imageBlob = await downloadImageAsBlob(imageUrl);
      const fileName = `${generation.id}.png`;
      const storageUrl = await uploadImageToStorage(imageBlob, fileName);

      if (!storageUrl) {
        throw new Error('上传图片失败');
      }

      await updateGeneration(generation.id, {
        image_url: storageUrl,
        status: 'success',
      });

      toast({
        title: '生成成功！',
        description: '你的宠物平行宇宙形象已创建完成',
      });

      navigate(`/result/${generation.id}`);
    } catch (error) {
      console.error('生成失败:', error);
      toast({
        title: '生成失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setGeneratingStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 xl:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">
            <span className="gradient-text">创造宠物宇宙</span>
          </h1>
          <p className="text-muted-foreground">填写信息，让AI为你的宠物创造独特的平行宇宙形象</p>
        </div>

        {creativeTemplates.length > 0 && (
          <Card className="mb-8 shadow-elegant">
            <CardHeader>
              <CardTitle>创意模板</CardTitle>
              <CardDescription>选择一个预设模板快速开始</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {creativeTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-smooth hover:shadow-glow ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>宠物信息</CardTitle>
            <CardDescription>填写你的宠物信息和想要的平行宇宙设定</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="petType"
                  rules={{ required: '请选择宠物种类' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>宠物种类 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择宠物种类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {petTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newIdentity"
                  rules={{ required: '请选择新身份' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新身份 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择新身份" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {identities.map((identity) => (
                            <SelectItem key={identity} value={identity}>
                              {identity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scenario"
                  rules={{ required: '请选择任务场景' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>任务场景 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择任务场景" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {scenarios.map((scenario) => (
                            <SelectItem key={scenario} value={scenario}>
                              {scenario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  rules={{ required: '请选择艺术风格' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>艺术风格 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择艺术风格" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {styles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/')}
                    disabled={isGenerating}
                  >
                    返回首页
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 shadow-elegant hover:shadow-glow"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        开始生成
                      </>
                    )}
                  </Button>
                </div>

                {isGenerating && generatingStatus && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{generatingStatus}</p>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
