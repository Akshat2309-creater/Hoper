import { useLocation, useNavigate } from "react-router-dom";
import Chat from "@/components/Chat";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = (location.state as { initialMessage?: string } | null) ?? null;
  const initialMessage = initialState?.initialMessage;

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden">
      <Chat isOpen={true} onClose={handleClose} initialMessage={initialMessage} />
    </div>
  );
};

export default ChatPage;

