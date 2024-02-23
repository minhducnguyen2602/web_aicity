from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import tempfile
import numpy as np
import pandas as pd
from sklearn.metrics import precision_recall_curve, average_precision_score
from io import StringIO 
import pickle
labels = ['','1-motorbike','2-DHelmet','3-DNoHelmet','4-P1Helmet','5-P1NoHelmet','6-P2Helmet:','7-P2NoHelmet:','8-P0Helmet','9-P0NoHelmet']
color_dict = {'1-motorbike':'black',
              '2-DHelmet' : 'Chartreuse',
              '3-DNoHelmet' : 'OrangeRed',
              '4-P1Helmet' : 'DarkViolet',
              '5-P1NoHelmet' : 'Orange',
              '6-P2Helmet:' : 'DodgerBlue',
              '7-P2NoHelmet:' : 'Yellow',
              '8-P0Helmet' : 'MediumOrchid',
              '9-P0NoHelmet' : 'DeepPink'}
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#Processing BBoxes
@app.post("/process_bboxes/")
async def upload_file(file: UploadFile = File(...), checklist: str = Form(...)):
    checklist = json.loads(checklist)
    # print(checklist)
    # return {"message": checklist}
    content = await file.read()

    # Process the text file content
    processed_content = process_text_file(content.decode("utf-8"), checklist)

    return JSONResponse(content={"processed_content": processed_content}, media_type="application/json")


def process_text_file(file_content: str, checklist: Dict):
    # Perform your desired processing on the file content
    # For example, you can split the content into lines:
        lines = file_content.split("\n")

        # Process each line (assuming each line contains bounding boxes)
        result_list = {}
        # print(process_line(lines[0].strip(), checklist))
        for line in lines:
            bbox_data = process_line(line.strip(), checklist)
            # print(bbox_data)
            if bbox_data:
                if len(bbox_data)==1:
                    continue
                if bbox_data['video_id'] not in result_list:
                    result_list[bbox_data['video_id']] = {}
                    result_list[bbox_data['video_id']][bbox_data['frame_id']] = [bbox_data]
                else:
                    if bbox_data['frame_id'] not in result_list[bbox_data['video_id']]:
                        result_list[bbox_data['video_id']][bbox_data['frame_id']] = [bbox_data]
                    else:
                        result_list[bbox_data['video_id']][bbox_data['frame_id']].append(bbox_data)
            else:
                print(line)
        for video in result_list:
            for i in range(1,201):
                if i not in result_list[video]:
                    result_list[video][i] = []

        return result_list


def process_line(line, checklist):
    global color_dict
    global labels
    w_ratio = 640.0/1920
    h_ratio = 360.0/1080 
    try:
        video_id,frame_id, x, y, width, height, label = list(map(int, line.split(',')))
        x = int(x*w_ratio)
        y = int(y*h_ratio)
        width = int(width*w_ratio)
        height = int(height*h_ratio)
        label = labels[label]
        if not checklist[label]:
            return [422]
        color = color_dict[label]
        result = {'video_id': video_id, 'frame_id': frame_id, 'x': x, 'y': y, 'width': width, 'height': height, 'label': label, 'color': color}
        # print(result)
        return result
    except: 
        # print(line)
        return None





def calculate_iou(box1, box2):
    # (x, y, width, height)
    x1, y1, w1, h1 = box1
    x2, y2, w2, h2 = box2

    intersect_x = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
    intersect_y = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))

    intersection = intersect_x * intersect_y
    union = w1 * h1 + w2 * h2 - intersection

    iou = intersection / (union + 1e-10)
    return iou

def calculate_ap(gt_boxes, pred_boxes, iou_threshold=0.4):
    # Sort predicted boxes by confidence
    pred_boxes = sorted(pred_boxes, key=lambda x: x[6], reverse=True)

    true_positives = np.zeros(len(pred_boxes))
    false_positives = np.zeros(len(pred_boxes))
    total_gt_boxes = len(gt_boxes)

    for i, pred_box in enumerate(pred_boxes):
        best_iou = 0
        best_gt_idx = -1
        video_id = pred_box[0]
        frame_id = pred_box[1]
        gt_box_this = [[box, id] for (id, box) in enumerate(gt_boxes) if box[0] == video_id and box[1] == frame_id]
        for j, [gt_box,_] in enumerate(gt_box_this):
            iou = calculate_iou(pred_box[2:6], gt_box[2:6])
            if iou > best_iou:
                best_iou = iou
                best_gt_idx = j

        if best_iou >= iou_threshold and best_gt_idx != -1 and gt_box_this[best_gt_idx][0][6] == pred_box[6]:
            true_positives[i] = 1
            gt_boxes.pop(gt_box_this[best_gt_idx][1])
        else:
            false_positives[i] = 1

    cumulative_true_positives = np.cumsum(true_positives)
    cumulative_false_positives = np.cumsum(false_positives)
    # print(cumulative_true_positives, cumulative_false_positives)
    recall = cumulative_true_positives / total_gt_boxes
    precision = cumulative_true_positives / (cumulative_true_positives + cumulative_false_positives + 1e-10)
    print(recall, precision)
    # Calculate Average Precision (AP)
    ap = 0
    for t in np.arange(0, 1.1, 0.1):
        if np.sum(recall >= t) == 0:
            p = 0
        else:
            p = np.max(precision[recall >= t])
        ap += p / 11

    return ap

def calculate_map(ground_truth, predictions, iou_threshold=0.4):
    all_classes_ap = []

    for class_id in range(1, 10):  # Assuming class labels start from 1
        gt_boxes = [box for box in ground_truth if box[6] == class_id]
        pred_boxes = [box for box in predictions if box[6] == class_id]

        ap = calculate_ap(gt_boxes, pred_boxes, iou_threshold)
        all_classes_ap.append(ap)

    mAP = np.mean(all_classes_ap)
    mAP = round(mAP, 5)
    all_classes_ap = [round(ap, 5) for ap in all_classes_ap]
    return mAP, all_classes_ap

if os.path.exists('history.pkl'):
    with open('history.pkl', 'rb') as file:
        history = pickle.load(file)
else:
    history = []
    with open('history.pkl', 'wb') as file:
        pickle.dump(history, file)


@app.post("/submit")
async def handle_upload_files(file1: UploadFile = File(...), file2: UploadFile = File(...),  note: str = Form(...) ):
    # return JSONResponse(content={"history": []}, status_code=200)
    global history
    gt_content = await file1.read()
    pred_content = await file2.read()

    # Convert file content to list of lists
    ground_truth = [list(map(float, line.strip().split(','))) for line in gt_content.decode().split('\n') if line.strip()]
    predictions = [list(map(float, line.strip().split(','))) for line in pred_content.decode().split('\n') if line.strip()]
    # index = len(history)
    # Process the contents of the files
    mAP, ap_per_class = calculate_map(ground_truth, predictions)
    history.append({'note':note, 'mAP': mAP, 'apClass1': ap_per_class[0], 'apClass2': ap_per_class[1], 'apClass3': ap_per_class[2], 'apClass4': ap_per_class[3], 'apClass5': ap_per_class[4], 'apClass6': ap_per_class[5], 'apClass7': ap_per_class[6], 'apClass8': ap_per_class[7], 'apClass9': ap_per_class[8]})
    with open('history.pkl', 'wb') as file:
        pickle.dump(history, file)
    return JSONResponse(content={"history": history}, status_code=200)

@app.get("/history")
async def load_history():
    return JSONResponse(content={"history": history}, status_code=200)