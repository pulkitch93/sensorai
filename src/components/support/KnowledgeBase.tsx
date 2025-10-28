import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ThumbsUp, Eye, Calendar } from 'lucide-react';
import { knowledgeArticles } from '@/lib/supportMockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KnowledgeArticle } from '@/types/support';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = knowledgeArticles.filter(article => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query)
    );
  });

  const categories = [...new Set(knowledgeArticles.map(a => a.category))];

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base... (try 'vibration', 'temperature', 'gateway')"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSearchQuery(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredArticles.map(article => (
                <Card
                  key={article.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {article.content}
                        </p>
                      </div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{article.helpfulCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {filteredArticles.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No articles found matching your search.</p>
                  <p className="text-sm mt-2">Try different keywords or browse by category.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline">{selectedArticle.category}</Badge>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{selectedArticle.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{selectedArticle.helpfulCount} helpful</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {selectedArticle.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex gap-1 flex-wrap">
                  {selectedArticle.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedArticle.relatedArticles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Related Articles</h4>
                  <div className="space-y-2">
                    {selectedArticle.relatedArticles.map(id => {
                      const related = knowledgeArticles.find(a => a.id === id);
                      return related ? (
                        <Button
                          key={id}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setSelectedArticle(related)}
                        >
                          <span className="text-sm">{related.title}</span>
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Helpful
                </Button>
                <Button variant="outline" className="flex-1">
                  Share Article
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
