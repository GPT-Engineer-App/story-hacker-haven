import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchHackerNewsStories = async () => {
  const response = await axios.get('https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=50');
  return response.data.hits;
};

const Index = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['hackerNewsStories'],
    queryFn: fetchHackerNewsStories,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Hacker News - Latest Stories</h1>
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="w-full h-16 mb-2" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto p-4 text-red-500">Error fetching stories</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hacker News - Latest Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {stories.map((story) => (
            <Card 
              key={story.objectID} 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedStory(story)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {story.points} points by {story.author} | {story.num_comments} comments
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="sticky top-4">
          {selectedStory && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedStory.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <a href={selectedStory.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Read full story
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  {selectedStory.points} points by {selectedStory.author} | {selectedStory.num_comments} comments
                </p>
                <p className="mt-4">{selectedStory.story_text || 'No additional text available.'}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
