FROM jenkins/jenkins:lts-jdk17

# Switch to root user to install tools
USER root

# Update package list
RUN apt-get update

# Install Docker CLI
RUN apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Install Maven
RUN apt-get install -y maven

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Clean up
RUN rm -rf /var/lib/apt/lists/*

# Verify installations
RUN mvn --version && node --version && npm --version && docker --version

# Switch back to jenkins user
USER jenkins

# Install Jenkins plugins
RUN jenkins-plugin-cli --plugins \
    git \
    workflow-aggregator \
    docker-workflow \
    nodejs \
    maven-plugin \
    pipeline-stage-view \
    junit
