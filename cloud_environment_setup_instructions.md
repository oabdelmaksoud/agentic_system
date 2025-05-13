# Agentic System Cloud Environment Setup Instructions

## Introduction

This document provides detailed instructions for setting up the cloud environment as the first task of Phase 1 (Foundation and Infrastructure Setup) of the Agentic System Pre-Production Roadmap (`pre_production_roadmap.md`). As outlined in the Phase 1 Infrastructure Setup Plan (`phase1_infrastructure_setup.md`), this task focuses on establishing cloud-based environments for development, testing, and staging using a cloud provider like AWS, Azure, or Google Cloud Platform (GCP). The setup is critical to support scalability and high availability as per the infrastructure layer requirements (SWREQ-IL-SCALE-001, SWREQ-IL-HA-001) and must be completed within Week 1 of the 4-week Phase 1 timeline.

## Objectives

- Select a suitable cloud provider based on organizational needs and cost-effectiveness.
- Create a Virtual Private Cloud (VPC) to isolate environments for security and separation.
- Provision compute resources for hosting containerized services.
- Implement containerization with Docker for application portability.
- Set up orchestration with Kubernetes for managing containerized workloads.
- Configure network security to restrict access and ensure protection.

## Timeline

- **Duration**: 1 week (Week 1 of Phase 1)
- **Start Date**: Immediately following approval of the Phase 1 plan
- **End Date**: End of Week 1

## Prerequisites

- Approval of the `phase1_infrastructure_setup.md` plan and the overarching `pre_production_roadmap.md`.
- Access to a cloud provider account with sufficient permissions to create resources (e.g., VPCs, compute instances, Kubernetes clusters).
- Budget approval for cloud resource usage during the pre-production phase.
- Team members with expertise in cloud infrastructure and DevOps practices.
- Access to necessary tools and software licenses (e.g., Terraform for Infrastructure as Code, if applicable).

## Step-by-Step Instructions

### Step 1: Select Cloud Provider
**Objective**: Choose a cloud provider that meets organizational preferences, technical requirements, and budget constraints.

- **Action**: Evaluate cloud providers such as AWS, Azure, and Google Cloud Platform (GCP) based on the following criteria:
  - **Service Offerings**: Ensure the provider offers managed Kubernetes services (e.g., AWS EKS, Azure AKS, Google GKE), managed databases (e.g., AWS RDS, Azure SQL Database), and robust security features.
  - **Cost-Effectiveness**: Compare pricing models using cost calculators provided by each provider to estimate monthly expenses for compute, storage, and network resources.
  - **AI/ML Capabilities**: If AI agent development is a priority, consider providers with strong AI/ML services (e.g., GCP for TensorFlow, AWS SageMaker).
  - **Organizational Familiarity**: Select a provider the team is familiar with to reduce learning curves and setup time.
- **Decision**: Document the chosen provider and rationale in a decision log for team reference. For example, select AWS if the organization already uses AWS services extensively.
- **Responsible**: Infrastructure Lead / DevOps Engineer
- **Output**: Decision log entry specifying the selected cloud provider (e.g., AWS).

### Step 2: Create Virtual Private Cloud (VPC)
**Objective**: Set up a VPC to isolate environments with subnets for development, testing, and staging, ensuring security and separation (SWREQ-IL-SEC-001).

- **Action**:
  1. Log in to the cloud provider's management console (e.g., AWS Management Console).
  2. Navigate to the VPC service (e.g., AWS VPC Dashboard).
  3. Create a new VPC with a defined CIDR block (e.g., 10.0.0.0/16) to accommodate multiple subnets.
  4. Create three subnets within the VPC for separation:
     - Development Subnet (e.g., 10.0.1.0/24)
     - Testing Subnet (e.g., 10.0.2.0/24)
     - Staging Subnet (e.g., 10.0.3.0/24)
  5. Configure route tables to ensure proper routing within the VPC and to the internet via an Internet Gateway if public access is needed for certain resources.
  6. Optionally, use Infrastructure as Code (IaC) tools like Terraform to script the VPC setup for repeatability and version control. Example Terraform script for AWS:
     ```hcl
     provider "aws" {
       region = "us-west-2"
     }
     
     resource "aws_vpc" "agentic_vpc" {
       cidr_block = "10.0.0.0/16"
       tags = {
         Name = "AgenticSystemVPC"
       }
     }
     
     resource "aws_subnet" "dev_subnet" {
       vpc_id            = aws_vpc.agentic_vpc.id
       cidr_block        = "10.0.1.0/24"
       availability_zone = "us-west-2a"
       tags = {
         Name = "DevSubnet"
       }
     }
     
     resource "aws_subnet" "test_subnet" {
       vpc_id            = aws_vpc.agentic_vpc.id
       cidr_block        = "10.0.2.0/24"
       availability_zone = "us-west-2b"
       tags = {
         Name = "TestSubnet"
       }
     }
     
     resource "aws_subnet" "stage_subnet" {
       vpc_id            = aws_vpc.agentic_vpc.id
       cidr_block        = "10.0.3.0/24"
       availability_zone = "us-west-2c"
       tags = {
         Name = "StageSubnet"
       }
     }
     ```
- **Responsible**: Infrastructure Engineer / DevOps Engineer
- **Output**: Configured VPC with subnets for development, testing, and staging environments. Documentation or IaC scripts for the setup.

### Step 3: Provision Compute Resources
**Objective**: Provision compute instances to host containerized services for the Agentic System (SWREQ-IL-COMP-001).

- **Action**:
  1. Navigate to the compute service in the cloud provider console (e.g., AWS EC2, Azure Virtual Machines, GCP Compute Engine).
  2. Create compute instances in each subnet (development, testing, staging) with specifications suitable for hosting Kubernetes nodes (e.g., t3.medium on AWS with 2 vCPUs and 4 GB RAM for initial setup, scalable later).
  3. Select an operating system image compatible with Docker and Kubernetes (e.g., Ubuntu 20.04 LTS for its wide support).
  4. Assign instances to the appropriate subnets created in Step 2, ensuring they are within the VPC for security.
  5. Configure instance security groups to allow necessary traffic (e.g., SSH on port 22 for administration, Kubernetes API on port 6443, and inter-node communication ports).
  6. Optionally, use IaC to automate instance creation. Example Terraform script for AWS EC2:
     ```hcl
     resource "aws_instance" "dev_node" {
       ami           = "ami-0c55b159cbfafe1f0" # Ubuntu 20.04 LTS AMI
       instance_type = "t3.medium"
       subnet_id     = aws_subnet.dev_subnet.id
       vpc_security_group_ids = [aws_security_group.k8s_sg.id]
       tags = {
         Name = "DevNode"
       }
     }
     
     resource "aws_security_group" "k8s_sg" {
       vpc_id = aws_vpc.agentic_vpc.id
       ingress {
         from_port   = 22
         to_port     = 22
         protocol    = "tcp"
         cidr_blocks = ["0.0.0.0/0"]
       }
       ingress {
         from_port   = 6443
         to_port     = 6443
         protocol    = "tcp"
         cidr_blocks = ["10.0.0.0/16"]
       }
       egress {
         from_port   = 0
         to_port     = 0
         protocol    = "-1"
         cidr_blocks = ["0.0.0.0/0"]
       }
       tags = {
         Name = "KubernetesSG"
       }
     }
     ```
- **Responsible**: Infrastructure Engineer / DevOps Engineer
- **Output**: Provisioned compute instances in each environment subnet with documented configurations or IaC scripts.

### Step 4: Implement Containerization with Docker
**Objective**: Install Docker on compute instances to enable containerization of application components for portability and scalability (SWREQ-IL-SCALE-001).

- **Action**:
  1. SSH into each compute instance provisioned in Step 3 using a secure key pair or cloud provider access method.
  2. Update the package index on the instance (e.g., `sudo apt update` on Ubuntu).
  3. Install Docker by following the official installation guide for the chosen OS (e.g., for Ubuntu, use `sudo apt install docker.io -y`).
  4. Start and enable the Docker service to ensure it runs on boot (e.g., `sudo systemctl start docker` and `sudo systemctl enable docker`).
  5. Verify Docker installation by running a test container (e.g., `sudo docker run hello-world`).
  6. Add the user to the Docker group to run Docker commands without sudo (e.g., `sudo usermod -aG docker $USER`).
  7. Optionally, script the installation for automation across multiple instances using tools like Ansible or a simple bash script:
     ```bash
     #!/bin/bash
     sudo apt update
     sudo apt install -y docker.io
     sudo systemctl start docker
     sudo systemctl enable docker
     sudo usermod -aG docker $USER
     sudo docker run hello-world
     echo "Docker installation completed"
     ```
- **Responsible**: DevOps Engineer
- **Output**: Docker installed and verified on all compute instances, with installation scripts or documentation for the process.

### Step 5: Set Up Orchestration with Kubernetes
**Objective**: Deploy Kubernetes clusters using managed services to orchestrate containers, ensuring high availability through auto-scaling and load balancing (SWREQ-IL-HA-001).

- **Action**:
  1. Navigate to the Kubernetes service in the cloud provider console (e.g., AWS EKS, Azure AKS, Google GKE).
  2. Create a managed Kubernetes cluster for each environment (development, testing, staging), specifying the VPC and subnets created in Step 2.
  3. Configure cluster settings:
     - Node Group: Define node groups with auto-scaling enabled (e.g., min 2, max 5 nodes) using the compute instances from Step 3 or managed node pools.
     - Networking: Use the VPC-native networking option (e.g., AWS CNI plugin) for seamless integration with VPC subnets.
     - Access: Enable private endpoint access initially for security, with public access configurable later if needed.
  4. Deploy the clusters and wait for them to become active (this may take 10-15 minutes per cluster).
  5. Configure local access to clusters using the cloud provider's CLI tools (e.g., `aws eks update-kubeconfig` for AWS EKS) to manage clusters from a local machine.
  6. Verify cluster setup by running basic Kubernetes commands (e.g., `kubectl get nodes` to list cluster nodes).
  7. Optionally, use IaC for cluster setup. Example Terraform script for AWS EKS:
     ```hcl
     module "eks" {
       source          = "terraform-aws-modules/eks/aws"
       cluster_name    = "agentic-dev-cluster"
       cluster_version = "1.21"
       subnets         = [aws_subnet.dev_subnet.id]
       vpc_id          = aws_vpc.agentic_vpc.id
       node_groups = {
         eks_nodes = {
           desired_capacity = 2
           max_capacity     = 5
           min_capacity     = 2
           instance_type    = "t3.medium"
         }
       }
       tags = {
         Name = "AgenticDevCluster"
       }
     }
     ```
- **Responsible**: DevOps Engineer / Kubernetes Specialist
- **Output**: Operational Kubernetes clusters for development, testing, and staging environments, with access configured and verification results documented.

### Step 6: Configure Network Security
**Objective**: Set up security groups, firewalls, and network policies to restrict access to environments, allowing only necessary traffic for protection (SWREQ-IL-SEC-001).

- **Action**:
  1. In the cloud provider console, navigate to the security group or network security section associated with the VPC created in Step 2.
  2. Create or update security groups for Kubernetes clusters and compute instances with inbound rules to allow:
     - SSH (port 22) from trusted IP ranges only (e.g., team office IP or VPN) for administration.
     - Kubernetes API (port 6443) and node communication ports (e.g., 10250, 30000-32767 for NodePort services) within the VPC CIDR block for internal communication.
     - HTTP/HTTPS (ports 80, 443) for potential public-facing services, initially restricted to specific IPs or later opened as needed.
  3. Define outbound rules to allow all traffic initially for flexibility during setup, to be tightened in later phases.
  4. Apply these security groups to all compute instances and Kubernetes node groups provisioned in Steps 3 and 5.
  5. Within Kubernetes, apply network policies to further restrict pod-to-pod communication, ensuring only necessary services interact (e.g., using Calico CNI if additional network policy support is needed).
  6. Document the security group rules and network policies for team reference and future audits.
- **Responsible**: Security Engineer / DevOps Engineer
- **Output**: Configured security groups and network policies applied to all environments, with detailed documentation of rules and access restrictions.

## Deliverables

- **Configured VPC**: A Virtual Private Cloud with subnets for development, testing, and staging environments, ensuring isolation and security.
- **Provisioned Compute Instances**: Compute resources provisioned in each subnet, ready to host containerized services.
- **Docker Installation**: Docker installed on all compute instances, verified with test containers, enabling application containerization.
- **Kubernetes Clusters**: Managed Kubernetes clusters deployed for each environment, configured for high availability with auto-scaling and load balancing.
- **Network Security Configurations**: Security groups, firewalls, and network policies set up to restrict access, protecting the environments with documented rules.

## Dependencies and Prerequisites

- Approval of the Phase 1 Infrastructure Setup Plan (`phase1_infrastructure_setup.md`).
- Availability of a cloud provider account with sufficient permissions to create and manage resources.
- Budget allocation for cloud resource usage during the setup period.
- Team members with expertise in cloud infrastructure, Kubernetes, and security configurations.
- Access to necessary tools, such as Terraform for IaC, and documentation for Docker and Kubernetes setup.

## Risks and Mitigation Strategies

- **Cloud Provider Issues**: Delays in resource provisioning due to provider outages or quota limits. Mitigation: Select a provider with high reliability, request quota increases in advance, and have a secondary provider as a backup.
- **Misconfigurations**: Errors in VPC, subnet, or security group setups leading to connectivity or security issues. Mitigation: Use Infrastructure as Code (IaC) tools like Terraform for consistent and repeatable configurations, and conduct peer reviews before applying changes.
- **Team Expertise Gaps**: Lack of familiarity with Kubernetes or cloud provider services slowing down setup. Mitigation: Provide quick training sessions or engage external consultants for initial setup, and leverage managed services to reduce complexity.
- **Security Oversights**: Initial security configurations leaving environments vulnerable. Mitigation: Follow security best practices from the start, limit public access during setup, and plan for immediate security audits post-setup.

## Conclusion

These Cloud Environment Setup Instructions provide a clear and actionable guide for completing Task 1 of Phase 1 in the Agentic System's pre-production roadmap. By following the outlined steps to select a cloud provider, create a VPC, provision compute resources, implement containerization with Docker, set up Kubernetes orchestration, and configure network security, the project will establish a robust foundation for subsequent development phases. Successful completion of this task within Week 1 is critical to maintaining the overall timeline and ensuring the infrastructure supports the scalability, security, and reliability required for the Agentic System as it progresses towards full functionality.
