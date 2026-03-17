import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
  Stack,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { FaRobot } from 'react-icons/fa6';

const quickActionKeys = [
  'deliveryStatus',
  'createOrder',
  'droneAvailability',
  'costEstimation',
  'customerSupport',
  'reportIssue',
  'orderModification',
  'operatingHours',
  'maxWeight',
  'cancelOrder',
];

function getBotResponse(userMsg, t) {
  const msg = userMsg.toLowerCase();

  // Parcel tracking / status
  if (msg.includes('where is my parcel') || msg.includes('parcel status') || msg.includes('track') || msg.includes('locate') ||
      msg.includes('di mana') || msg.includes('bungkusan') || msg.includes('penjejakan') ||
      msg.includes('என் பார்சல்') || msg.includes('கண்காணி') || msg.includes('我的包裹')) {
    return t('chatbot.responseParcelStatus');
  }

  // Create order
  if (msg.includes('send a parcel') || msg.includes('create delivery') || msg.includes('create order') || msg.includes('new order') || msg.includes('place order') ||
      msg.includes('hantar') || msg.includes('pesanan') || msg.includes('cipta pesanan') ||
      msg.includes('ஆர்டர் உருவாக்கு') || msg.includes('பார்சல் அனுப்பு') || msg.includes('创建') || msg.includes('寄送')) {
    return t('chatbot.responseCreateOrder');
  }

  // Drone availability
  if (msg.includes('drone available') || msg.includes('drones available') || msg.includes('available drone') || msg.includes('standby') ||
      msg.includes('dron tersedia') || msg.includes('tersedia') ||
      msg.includes('ட்ரோன் கிடைக்கு') || msg.includes('无人机可用') || msg.includes('有无人机')) {
    return t('chatbot.responseDroneAvailable');
  }

  // Cost / pricing
  if (msg.includes('how much') || msg.includes('cost') || msg.includes('price') || msg.includes('fee') || msg.includes('rate') || msg.includes('charge') ||
      msg.includes('berapa') || msg.includes('kos') || msg.includes('harga') || msg.includes('bayaran') ||
      msg.includes('எவ்வளவு') || msg.includes('கட்டணம்') || msg.includes('多少钱') || msg.includes('费用') || msg.includes('价格')) {
    return t('chatbot.responseCost');
  }

  // Operating hours
  if (msg.includes('operating hours') || msg.includes('opening hours') || msg.includes('business hours') || msg.includes('when are you open') || msg.includes('what time') ||
      msg.includes('waktu operasi') || msg.includes('waktu buka') || msg.includes('jam berapa') ||
      msg.includes('இயக்க நேரம்') || msg.includes('திறந்திருக்கும்') || msg.includes('营业时间') || msg.includes('几点')) {
    return t('chatbot.responseOperatingHours');
  }

  // Max weight / weight limit
  if (msg.includes('maximum weight') || msg.includes('max weight') || msg.includes('weight limit') || msg.includes('heavy parcel') || msg.includes('parcel weight') || msg.includes('how heavy') ||
      msg.includes('berat bungkusan') || msg.includes('had berat') ||
      msg.includes('அதிகபட்ச எடை') || msg.includes('பொதி எடை') || msg.includes('最大重量') || msg.includes('包裹重量')) {
    return t('chatbot.responseMaxWeight');
  }

  // How it works
  if (msg.includes('how does') || msg.includes('how it works') || msg.includes('explain') || msg.includes('tell me about') ||
      msg.includes('bagaimana') || msg.includes('cara kerja') ||
      msg.includes('எப்படி வேலை') || msg.includes('என்னவென்று') || msg.includes('如何运作') || msg.includes('怎么工作')) {
    return t('chatbot.responseHowItWorks');
  }

  // Delayed / not arrived
  if (msg.includes("hasn't arrived") || msg.includes('not arrived') || msg.includes('delayed') || msg.includes('late') || msg.includes('still waiting') || msg.includes('missing parcel') ||
      msg.includes('belum sampai') || msg.includes('lewat') || msg.includes('lambat') ||
      msg.includes('இன்னும் வரவில்லை') || msg.includes('தாமதம்') || msg.includes('还没到') || msg.includes('迟到')) {
    return t('chatbot.responseDelayed');
  }

  // Change address
  if ((msg.includes('change') || msg.includes('update') || msg.includes('modify')) && (msg.includes('address') || msg.includes('location') || msg.includes('destination')) ||
      msg.includes('tukar alamat') || msg.includes('update address') || msg.includes('new address') ||
      msg.includes('முகவரி மாற்று') || msg.includes('更改地址') || msg.includes('修改地址')) {
    return t('chatbot.responseAddressUpdated');
  }

  // Cancel order
  if (msg.includes('cancel') || msg.includes('terminate order') || msg.includes('stop order') || msg.includes('undo order') ||
      msg.includes('batal') || msg.includes('batalkan') ||
      msg.includes('ரத்து') || msg.includes('取消')) {
    return t('chatbot.responseCancelled');
  }

  return t('chatbot.responseDefault');
}

const Chatbot = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { sender: 'bot', text: null, useKey: 'chatbot.greeting' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (msg) => {
    const userMsg = msg !== undefined ? msg : input;
    if (!userMsg.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const response = getBotResponse(userMsg, t);
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setLoading(false);
    }, 900);
  };

  const hasOnlyGreeting = messages.length === 1 && messages[0].useKey === 'chatbot.greeting';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: isDark ? 'rgba(12,26,36,0.5)' : 'rgba(240,246,248,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: isDark ? 'rgba(20,184,166,0.05)' : 'rgba(15,118,110,0.03)',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(15,118,110,0.15)',
            borderRadius: '4px',
            '&:hover': {
              bgcolor: isDark ? 'rgba(20,184,166,0.3)' : 'rgba(15,118,110,0.25)',
            },
          },
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-end',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: msg.sender === 'user' ? 'translateX(20px)' : 'translateX(-20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            {msg.sender === 'bot' && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                  flexShrink: 0,
                }}
              >
                <FaRobot size={16} color="#fff" />
              </Avatar>
            )}
            <Paper
              sx={{
                p: 1.5,
                px: 2,
                maxWidth: '70%',
                bgcolor: msg.sender === 'user'
                  ? 'primary.main'
                  : isDark ? 'rgba(20,184,166,0.08)' : 'rgba(240,246,248,0.8)',
                color: msg.sender === 'user' ? '#fff' : 'text.primary',
                borderRadius: msg.sender === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                boxShadow: msg.sender === 'user'
                  ? '0 4px 12px rgba(15,118,110,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                }}
              >
                {msg.useKey ? t(msg.useKey) : msg.text}
              </Typography>
            </Paper>
            {msg.sender === 'user' && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>U</Typography>
              </Avatar>
            )}
          </Box>
        ))}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                flexShrink: 0,
              }}
            >
              <FaRobot size={16} color="#fff" />
            </Avatar>
            <Paper
              sx={{
                p: 2,
                bgcolor: isDark ? 'rgba(20,184,166,0.08)' : 'rgba(240,246,248,0.8)',
                borderRadius: '18px 18px 18px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={20} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary">
                {t('chatbot.typing')}
              </Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Actions - Only show on first message */}
      {hasOnlyGreeting && !loading && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,118,110,0.06)'}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {quickActionKeys.map((key, idx) => (
            <Tooltip key={idx} title={t(`chatbot.action_${key}`)} arrow>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSend(t(`chatbot.action_${key}_value`))}
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  borderColor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(15,118,110,0.15)',
                  color: isDark ? 'rgba(20,184,166,0.8)' : '#0f766e',
                  bgcolor: isDark ? 'rgba(20,184,166,0.05)' : 'rgba(20,184,166,0.05)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.08)',
                    borderColor: isDark ? 'rgba(20,184,166,0.3)' : 'rgba(15,118,110,0.25)',
                  },
                }}
              >
                {t(`chatbot.action_${key}`)}
              </Button>
            </Tooltip>
          ))}
        </Box>
      )}

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${isDark ? 'rgba(20,184,166,0.08)' : 'rgba(15,118,110,0.06)'}`,
          bgcolor: isDark ? 'rgba(6,14,20,0.3)' : 'rgba(255,255,255,0.3)',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }}}
          placeholder={t('chatbot.placeholder')}
          disabled={loading}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(15,32,44,0.8)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${isDark ? 'rgba(20,184,166,0.12)' : 'rgba(15,118,110,0.12)'}`,
              '&:hover': {
                borderColor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(15,118,110,0.2)',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 3px ${isDark ? 'rgba(20,184,166,0.1)' : 'rgba(20,184,166,0.08)'}`,
              },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '0.95rem',
              '&::placeholder': {
                opacity: 0.6,
              },
            },
          }}
        />
        <Tooltip title={loading ? t('chatbot.typing') : t('chatbot.send')} arrow>
          <IconButton
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            sx={{
              background: loading || !input.trim()
                ? isDark ? 'rgba(20,184,166,0.08)' : 'rgba(15,118,110,0.08)'
                : 'linear-gradient(135deg, #0f766e, #14b8a6)',
              color: loading || !input.trim()
                ? isDark ? 'rgba(20,184,166,0.4)' : 'rgba(15,118,110,0.4)'
                : '#fff',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover:not(:disabled)': {
                background: 'linear-gradient(135deg, #115e59, #0f766e)',
                boxShadow: '0 4px 12px rgba(15,118,110,0.3)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Chatbot;
