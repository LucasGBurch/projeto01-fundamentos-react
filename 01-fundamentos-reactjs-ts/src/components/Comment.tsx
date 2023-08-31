import { ThumbsUp, Trash } from 'phosphor-react';
import { useState } from 'react';
import { Avatar } from './Avatar';
import styles from './Comment.module.css';

interface CommentProps {
  content: string;
  onDeleteComment: (comment: string) => void;
}

export function Comment({ content, onDeleteComment }: CommentProps) {
  const [likeCount, setLikeCount] = useState(0);

  function handleDeleteComment() {
    onDeleteComment(content);
  }

  function handleLikeComment() {
    setLikeCount((prevState) => {
      return prevState + 1;
    });
    // Não poderíamos chamar direto no onClick, pois geraria um loop com a chamada. A solução seria uma arrow function, MAAAS, o handle é preferível pela legibilidade na maioria dos casos.
  }
  // Sempre que atualizar uma informação que dependa do valor anterior, é sempre melhor fazer a atualização no padrão de funções ali do prevState. Assim o contexto anterior (0) mudará a cada setter chamado.

  return (
    <div className={styles.comment}>
      <Avatar hasBorder={false} src='https://github.com/LucasGBurch.png' alt='' />

      <div className={styles.commentBox}>
        <div className={styles.commentContent}>
          <header>
            <div className={styles.authorAndTime}>
              <strong>Lucas Burch</strong>
              <time
                title='12 de Janeiro às 16:45h'
                dateTime='2023-01-12 16:45:30'
              >
                Cerca de 1h atrás
              </time>
            </div>

            <button onClick={handleDeleteComment} title='Deletar comentário'>
              <Trash size={24} />
            </button>
          </header>

          <p>{content}</p>
        </div>

        <footer>
          <button onClick={handleLikeComment}>
            <ThumbsUp />
            Aplaudir <span>{likeCount}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
