export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: null | string;
    caption: null | string;
    width: number;
    height: number;
    formats: null | any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: null | string;
    provider: string;
    provider_metadata: null | any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Comment {
  id: number;
  documentId: string;
  attributes: {
    content: string;
    createdAt: string;
    author: {
      data: {
        id: number;
        attributes: {
          username: string;
          avatar?: {
            id: number;
            documentId: string;
            name: string;
            alternativeText: null | string;
            caption: null | string;
            width: number;
            height: number;
            formats: null | any;
            hash: string;
            ext: string;
            mime: string;
            size: number;
            url: string;
            previewUrl: null | string;
            provider: string;
            provider_metadata: null | any;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
          };
        };
      };
    };
  };
}

export interface CommentFormProps {
  contentType: string;
  contentId: number;
  onCommentAdded?: () => void;
}

export interface CommentsListProps {
  contentType: string;
  contentSlug: string; // Исправлено с contentId на contentSlug
}

export interface CommentsSectionProps {
  contentType: string;
  contentSlug: string;
}