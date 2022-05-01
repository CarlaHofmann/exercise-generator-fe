export type Topic = {
    id: number;
    topic_name: string;
};

export type GetTopicsResponse = {
    data: Topic[];
};
