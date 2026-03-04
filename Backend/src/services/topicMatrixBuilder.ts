type Topic = {
  name: string;
  category: string;
};

export function buildTopicMatrix(topics: Topic[]) {
  const matrix: Record<string, string[]> = {};

  for (const topic of topics) {
    const category = topic.category;

    if (!matrix[category]) {
      matrix[category] = [];
    }

    matrix[category].push(topic.name);
  }

  return matrix;
}