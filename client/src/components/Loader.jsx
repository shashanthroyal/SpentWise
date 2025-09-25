const spinnerStyle = {
  display: 'inline-block',
  width: 40,
  height: 40,
  border: '4px solid #3b82f6',
  borderTop: '4px solid transparent',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 160,
};

export default function Loader() {
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
