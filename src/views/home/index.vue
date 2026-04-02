<template>
  <div class="home">
    <!-- 动态背景网格 -->
    <div class="bg-grid"></div>
    <!-- 渐变光晕 -->
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>

    <!-- 主内容 -->
    <div class="content">
      <div class="hero">
        <p class="subtitle">Welcome to</p>
        <h1 class="title">
          <span class="title-line" v-for="(char, i) in 'Template'" :key="i" :style="{ animationDelay: `${i * 0.1}s` }">
            {{ char === ' ' ? '\u00A0' : char }}
          </span>
        </h1>
        <p class="tagline">Vue 3 + TypeScript + Vite 构建的现代应用</p>
      </div>

      <div class="features">
        <div class="feature-card" v-for="(feature, i) in features" :key="i" :style="{ animationDelay: `${0.6 + i * 0.15}s` }">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>

      <div class="status-bar">
        <div class="status-item">
          <span class="status-dot"></span>
          <span>环境: {{ mode }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">项目:</span>
          <span class="status-value">{{ appTitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const appTitle = ref(import.meta.env.VITE_APP_TITLE || 'template-vue3')
const mode = ref(import.meta.env.MODE)

const features = [
  { icon: '⚡', title: 'Vite', desc: '闪电般的开发服务器和构建速度' },
  { icon: '🎯', title: 'TypeScript', desc: '完整的类型安全与智能提示' },
  { icon: '✨', title: 'Vue 3', desc: '组合式 API 与响应式系统' },
  { icon: '🎨', title: 'SCSS', desc: '优雅的样式与主题定制' }
]

onMounted(async () => {
  console.log(appTitle.value)
  console.log(mode.value)
})
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
  color: #fff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

// 动态网格背景
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%);
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(60px); }
}

// 渐变光晕
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  pointer-events: none;
}

.glow-orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  left: -100px;
  animation: float1 15s ease-in-out infinite;
}

.glow-orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -150px;
  right: -100px;
  animation: float2 18s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 30px) scale(1.1); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -20px) scale(1.05); }
}

// 主内容区
.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.subtitle {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 10px;
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.title {
  font-size: clamp(60px, 12vw, 140px);
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-line {
  display: inline-block;
  animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(40px) rotateX(-90deg);
}

@keyframes charReveal {
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 20px;
  letter-spacing: 2px;
  animation: fadeInUp 0.8s ease-out 0.5s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 特性卡片
.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 900px;
  width: 100%;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .feature-icon {
      transform: scale(1.2) rotate(5deg);
    }
  }

  .feature-icon {
    font-size: 36px;
    margin-bottom: 14px;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
    color: #fff;
  }

  p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    line-height: 1.5;
  }
}

// 状态栏
.status-bar {
  display: flex;
  gap: 30px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50px;
  animation: fadeInUp 0.8s ease-out 1.2s forwards;
  opacity: 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

.status-value {
  color: #667eea;
  font-weight: 500;
}
</style>
