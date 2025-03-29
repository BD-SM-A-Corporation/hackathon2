FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-jdk \
    curl \
    git \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_HOME /usr/local/android-sdk
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip
RUN unzip cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools
RUN mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest

# Add Android SDK to PATH
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# Install Android SDK components
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Start Metro bundler
CMD ["npm", "start"]