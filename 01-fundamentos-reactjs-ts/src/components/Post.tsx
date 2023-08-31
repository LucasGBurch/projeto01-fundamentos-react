import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';

import { Avatar } from './Avatar';
import { Comment } from './Comment';

import styles from './Post.module.css';

// estado = variáveis que eu quero que o componente monitore

interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

export interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState(['Comentário legal']);
  const [newCommentText, setNewCommentText] = useState<string>('');
  /* Momentos em que uma aplicação renderiza novamente:
  1) Alteração de estado.
  2) Alteração de propriedade (props).
  3) Quando um componente pai renderiza novamente.
  
  Nesse contexto, as keys ajudam o React a entender o que já estava em tela e o que ele precisa adicionar na nova renderização. É por isso que os valores das keys devem ser únicos! Índices de array não servem porque, em caso de troca de posição, o React renderiza tudo de novo
  */

  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    }
  ); // aspas fimples para "escapar" de, às e h;
  // FORMATADOR DE DATAS
  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true, // no pt é prefixo, mas em inglês costuma ser sufixo
  });

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComments([...comments, newCommentText]);

    setNewCommentText('');
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value);
  } // Text Area para o setCustomValidity

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório!');
  }

  function deleteComment(commentToDelete: string) {
    /* Imutabilidade => as variáveis não sofrem mutação. Nunca alteramos uma variável na memória, ou seja, nós criamos um novo valor, um novo espaço na memória. */
    const commentsWithoutDeletedOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });

    // NUNCA ALTERAMOS INFORMAÇÃO EM REACT, CRIAMOS NOVAS:
    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} key={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line) => {
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>;
          } else {
            return (
              <p key={line.content}>
                <a href='#'>{line.content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          name='comment'
          placeholder='Deixe um comentário'
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type='submit' disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
