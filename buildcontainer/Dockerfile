FROM debian:stretch

ENV https_proxy="http://172.16.18.4:80/" 

ENV http_proxy="http://172.16.18.4:80/" 

# unzip, zip, python, build-essential (make, gcc and more) ...
RUN apt-get update && \
    apt-get -y install --no-install-recommends ca-certificates unzip zip python curl openssh-client git-core build-essential jq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# terraform
ENV TERRAFORM_VERSION 0.11.14
ENV TERRAFORM_CHECKSUM 9b9a4492738c69077b079e595f5b2a9ef1bc4e8fb5596610f69a6f322a8af8dd
RUN curl -fsSL https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o terraform.zip  && \
    echo "${TERRAFORM_CHECKSUM} terraform.zip" | sha256sum -c - && \
    unzip terraform.zip -d /usr/local/bin && chmod +x /usr/local/bin/terraform ; rm terraform.zip

# terraform terraform provider plugin (for remote state)
ENV TERRAFORM_TERRAFORM_PLUGIN_VERSION 1.0.2
ENV TERRAFORM_TERRAFORM_PLUGIN_CHECKSUM c4c1e826c85ef45fb18ca75e06284d13b0f72bce61a652e74eb016cf7779eafd
RUN curl -fsSL https://releases.hashicorp.com/terraform-provider-terraform/${TERRAFORM_TERRAFORM_PLUGIN_VERSION}/terraform-provider-terraform_${TERRAFORM_TERRAFORM_PLUGIN_VERSION}_linux_amd64.zip -o terraform_terraform_plugin.zip  && \
    echo "${TERRAFORM_TERRAFORM_PLUGIN_CHECKSUM} terraform_terraform_plugin.zip" | sha256sum -c - && \
    unzip terraform_terraform_plugin.zip -d /usr/local/lib/custom-terraform-plugins ; rm terraform_terraform_plugin.zip

# terraform template provider plugin
ENV TERRAFORM_TEMPLATE_PLUGIN_VERSION 2.1.2
ENV TERRAFORM_TEMPLATE_PLUGIN_CHECKSUM 149e4bf47ac21b67f6567767afcd29caaf0b0ca43714748093a00a2a98cd17a8
RUN curl -fsSL https://releases.hashicorp.com/terraform-provider-template/${TERRAFORM_TEMPLATE_PLUGIN_VERSION}/terraform-provider-template_${TERRAFORM_TEMPLATE_PLUGIN_VERSION}_linux_amd64.zip -o terraform_template_plugin.zip  && \
    echo "${TERRAFORM_TEMPLATE_PLUGIN_CHECKSUM} terraform_template_plugin.zip" | sha256sum -c - && \
    unzip terraform_template_plugin.zip -d /usr/local/lib/custom-terraform-plugins ; rm terraform_template_plugin.zip

# terraform null provider plugin
ENV TERRAFORM_NULL_PLUGIN_VERSION 2.1.2
ENV TERRAFORM_NULL_PLUGIN_CHECKSUM 16fc2d9b10cf9e5123bf956e7032c338cc93a03be1ca2e9f3d3b7014c0e866c7
RUN curl -fsSL https://releases.hashicorp.com/terraform-provider-null/${TERRAFORM_NULL_PLUGIN_VERSION}/terraform-provider-null_${TERRAFORM_NULL_PLUGIN_VERSION}_linux_amd64.zip -o terraform_null_plugin.zip  && \
    echo "${TERRAFORM_NULL_PLUGIN_CHECKSUM} terraform_null_plugin.zip" | sha256sum -c - && \
    unzip terraform_null_plugin.zip -d /usr/local/lib/custom-terraform-plugins ; rm terraform_null_plugin.zip

# terraform aws provider plugin
ENV TERRAFORM_AWS_PLUGIN_VERSION 2.48.0
ENV TERRAFORM_AWS_PLUGIN_CHECKSUM 5649efdd9e0889616c78e4d3c9271fa15e88ffdc9dae49248c15f67ff2bcfa9f
RUN curl -fsSL https://releases.hashicorp.com/terraform-provider-aws/${TERRAFORM_AWS_PLUGIN_VERSION}/terraform-provider-aws_${TERRAFORM_AWS_PLUGIN_VERSION}_linux_amd64.zip -o terraform_aws_plugin.zip  && \
    echo "${TERRAFORM_AWS_PLUGIN_CHECKSUM} terraform_aws_plugin.zip" | sha256sum -c - && \
    unzip terraform_aws_plugin.zip -d /usr/local/lib/custom-terraform-plugins ; rm terraform_aws_plugin.zip

# aws cli
RUN curl -sSL https://s3.amazonaws.com/aws-cli/awscli-bundle.zip -o awscli-bundle.zip && \
    unzip awscli-bundle.zip && \
    ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws && \
    rm awscli-bundle.zip && rm -rf ./awscli-bundle

WORKDIR /build
ENTRYPOINT [ "/usr/bin/make" ]
