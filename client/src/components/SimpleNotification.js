import React, { useState, useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-bootstrap/Fade';

/**
 * 简化版通知 Hook
 * 可以在任何组件中直接使用，无需 Provider
 * 支持自动关闭功能和动画效果
 */
export const useSimpleNotification = () => {
  const [notification, setNotification] = useState({ 
    open: false,
    closing: false, // 新增：用于控制关闭动画
    message: '', 
    type: 'info',
    autoClose: true,
    duration: 5000
  });
  
  const timerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const showNotification = (message, type = 'info', options = {}) => {
    const {
      autoClose = true,
      duration = 5000
    } = options;

    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    // 设置为显示状态
    setNotification({ 
      open: true,
      closing: false,
      message, 
      type, 
      autoClose, 
      duration 
    });

    // 设置自动关闭
    if (autoClose) {
      timerRef.current = setTimeout(() => {
        closeNotification();
      }, duration);
    }
  };

  const closeNotification = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 先播放关闭动画
    setNotification(prev => ({ ...prev, closing: true }));
    
    // 等待动画完成后再隐藏
    closeTimerRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false, closing: false }));
    }, 300); // 动画持续时间
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // 返回通知组件和控制函数
  const NotificationComponent = () => {
    if (!notification.open) return null;

    const getVariant = () => {
      switch (notification.type) {
        case 'success': return 'success';
        case 'error': return 'danger';
        case 'warning': return 'warning';
        default: return 'info';
      }
    };

    const getIcon = () => {
      switch (notification.type) {
        case 'success': return '✅ ';
        case 'error': return '❌ ';
        case 'warning': return '⚠️ ';
        default: return 'ℹ️ ';
      }
    };

    return (
      <>
        <style>
          {`
            @keyframes slideInFromTop {
              from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
              }
            }
            
            @keyframes slideOutToTop {
              from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
              }
              to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
              }
            }
            
            .notification-slide-in {
              animation: slideInFromTop 0.3s ease-out;
              transform: translateX(-50%) translateY(0);
            }
            
            .notification-slide-out {
              animation: slideOutToTop 0.3s ease-in;
              transform: translateX(-50%) translateY(0);
            }
          `}
        </style>
        <div
          className={notification.closing ? "notification-slide-out" : "notification-slide-in"}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px'
          }}
        >
          <Alert 
            variant={getVariant()}
            dismissible
            onClose={closeNotification}
            style={{
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              margin: 0
            }}
          >
            {getIcon()}{notification.message}
          </Alert>
        </div>
      </>
    );
  };

  return {
    showNotification,
    closeNotification,
    NotificationComponent
  };
};

// 使用示例：
/*
function MyComponent() {
  const { showNotification, NotificationComponent } = useSimpleNotification();
  
  const handleSuccess = () => {
    // 默认5秒后自动关闭
    showNotification('操作成功！', 'success');
  };
  
  const handleLongMessage = () => {
    // 10秒后自动关闭
    showNotification('这是一个重要的长消息...', 'warning', {
      duration: 10000
    });
  };
  
  const handlePersistent = () => {
    // 不自动关闭，需要手动点击关闭
    showNotification('重要提醒：请手动关闭', 'error', {
      autoClose: false
    });
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>成功通知</button>
      <button onClick={handleLongMessage}>长时间通知</button>
      <button onClick={handlePersistent}>持久通知</button>
      <NotificationComponent />
    </div>
  );
}
*/