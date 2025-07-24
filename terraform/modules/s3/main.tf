resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.project_name}-artifacts"
  force_destroy = true

  tags = {
    Name = "${var.project_name}-artifacts"
  }
}
