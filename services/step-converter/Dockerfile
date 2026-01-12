# FreeCAD + OpenSCAD STEP Converter Service
# Converts OpenSCAD code to STEP format using FreeCAD's B-Rep engine

FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install FreeCAD, OpenSCAD and dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository -y ppa:freecad-maintainers/freecad-stable \
    && apt-get update \
    && apt-get install -y \
    freecad \
    openscad \
    curl \
    git \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install BOSL2 library for OpenSCAD
RUN mkdir -p /usr/share/openscad/libraries && \
    git clone --depth 1 https://github.com/BelfrySCAD/BOSL2.git /usr/share/openscad/libraries/BOSL2

# Install Python dependencies for HTTP API
RUN pip3 install --no-cache-dir \
    fastapi==0.109.0 \
    uvicorn[standard]==0.27.0 \
    python-multipart==0.0.6

# Create app directory
WORKDIR /app

# Copy conversion scripts
COPY converter.py /app/
COPY main.py /app/

# Create temp directory for conversions
RUN mkdir -p /tmp/conversions

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the API server
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
