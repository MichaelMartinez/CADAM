import { Message } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModelViewer } from './ModelViewer';
import { Link } from 'react-router-dom';

interface ModelCardProps {
  message: Message;
}

export function ModelCard({ message }: ModelCardProps) {
  if (!message.content.artifact?.code) {
    return null;
  }

  return (
    <Link to={`/editor/${message.conversation_id}`}>
      <Card>
        <CardHeader>
          <CardTitle className="truncate">Version</CardTitle>
        </CardHeader>
        <CardContent>
          <ModelViewer scadCode={message.content.artifact.code} />
        </CardContent>
      </Card>
    </Link>
  );
}
